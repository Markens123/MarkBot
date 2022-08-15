import got from 'got';
import * as cheerio from 'cheerio';
import { AnimeI, SimpleAnime } from '../../../../lib/interfaces/Main';
import { EmbedBuilder } from 'discord.js';

class AnimeAPI {
  url: string = 'https://animixplay.to/';
  api_url: string = 'https://api.myanimelist.net/v2/anime';


  async getLatest(count: number = 20): Promise<SimpleAnime[]> {

    if (!process.env.MAL_CLIENT_ID) {
      return null
    }

    const $ = cheerio.load(await this.getHTML());

    let arr: { title: string, episode: number, url: string }[] = [];

    let farr = [];

    const list = $('#resultplace > ul').children();

    list.each((i, e) => {
      arr.push({
        title: $(e).children().attr('title'), 
        episode: parseEps($(e).children().attr('href')), 
        url: `https://animixplay.to${$(e).children().attr('href')}`})
    });

    for (let i = 0; i < arr.length; i++) {
      const anime = await this.getRawVideoData(arr[i].title)
      if (anime) {
        const simple = await this.toSimple(anime, arr[i].episode, arr[i].url);
    
        farr.push(simple);
      }
    }

    return farr.slice(0, count);
  }


  async getHTML(): Promise<string> {
    const { body } = await got.get(this.url);
    return body;
  }

  async toSimple(og: AnimeI, eps: number, url): Promise<SimpleAnime> {
    return {
      id: og.id.toString(),
      title: og.title,
      mal_url: `https://myanimelist.net/anime/${og.id}`,
      url,
      image: og.main_picture.medium,
      eps,
      alt_titles: Object.values(og.alternative_titles)?.flat() ?? [],
      genres: og.genres?.map(x => x.name) ?? [],
      type: og.media_type
    };  
  }

  async getRawVideoData(title: string): Promise<AnimeI | undefined> {
    const searchParams = new URLSearchParams([
      ['q', title.substring(0, 30)], 
      ['limit', '10'], 
      ['fields', 'id,title,main_picture,media_type,genres,alternative_titles'],
      ['nsfw', 'true'],
    ]);
    
    const { body } = await got(this.api_url, { 
      //@ts-expect-error typescript is being dumb :P
      searchParams, 
      headers: {
        "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
      }  
    });

    const animes = JSON.parse(body).data.map(x => x.node) as AnimeI[];

    const filtered = animes.filter(anime => anime?.title.toLowerCase() === title.toLowerCase());

    if (animes?.length === 0) return undefined
    else if (filtered.length != 0) return filtered[0]
    else return animes[0]
  }

  genEmbeds(data: SimpleAnime[]): EmbedBuilder[] {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(
        new EmbedBuilder()
          .setTitle(`New Episode for ${data[i].alt_titles[0] || data[i].title}`)
          .setDescription(`[Episode ${data[i].eps}](${data[i].url})\n[Mal Url](${data[i].mal_url})`)
          .setImage(data[i].image)
          .setColor('Random')
          .setFooter({ text: `${data[i].type.toUpperCase()} • ${shorten(data[i].genres.join(' • '), 2000, ' • ')}` })
        )
    }
    return arr;
  }
}

function parseEps(str: string): number {
  const last = str.split('/').pop();
  const num = parseInt(last.replace('ep', ''));

  if (!num) return 1
  else return num
}

function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export default AnimeAPI;
