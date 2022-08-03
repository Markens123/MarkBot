import got from 'got';
import * as cheerio from 'cheerio';
import { AnimeI, SimpleAnime } from '../../../../lib/interfaces/Main';
import { EmbedBuilder } from 'discord.js';
import { getMalUrl } from '../../../util/Constants.js';

class AnimeAPI {
  url: string = 'https://animixplay.to/';
  api_url: string = 'https://api.myanimelist.net/v2/anime';


  async getLatest(count: number = 20): Promise<SimpleAnime[]> {

    const $ = cheerio.load(await this.getHTML());

    let arr: { title: string, episode: number }[] = [];

    let farr = [];

    const list = $('#resultplace > ul').children();

    list.each((i, e) => {
      arr.push({title: $(e).children().attr('title'), episode: parseEps($(e).children().attr('href'))})
    });

    for (let i = 0; i < arr.length; i++) {
      const anime = await this.getRawVideoData(arr[i].title)
      if (anime) {
        const simple = await this.toSimple(anime, arr[i].episode);
    
        farr.push(simple);
      }
    }

    return farr.slice(0, count);
  }


  async getHTML(): Promise<string> {
    const { body } = await got.get(this.url);
    return body;
  }

  async toSimple(og: AnimeI, eps: number): Promise<SimpleAnime> {
    return {
      id: og.id,
      title: og.attributes.canonicalTitle,
      mal_url: await getMalUrl(og.links.self),
      image: og.attributes.posterImage.small,
      eps,
      alt_titles: Object.values(og.attributes.titles).map(x => x.toLowerCase())
    };  
  }

  async getRawVideoData(title: string): Promise<AnimeI | undefined> {

    const searchParams = new URLSearchParams([
      ['q', title], 
      ['limit', '10'], 
      ['fields', 'id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes'],
      ['nsfw', 'true']
    ]);
    
    //@ts-expect-error typescript is being dumb :P
    const { body } = await got(this.api_url, {searchParams});

    const animes = JSON.parse(body).data as AnimeI[];

    const filtered = animes.filter(anime => anime.attributes.canonicalTitle.toLowerCase() === title.toLowerCase());


    if (animes?.length === 0) return undefined
    else if (filtered.length != 0) return filtered[0]
    else return animes[0]
  }

  genEmbeds(data: SimpleAnime[]): EmbedBuilder[] {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(
        new EmbedBuilder()
          .setTitle(data[i].title)
          .setURL(data[i].mal_url)
          .setDescription(`Episode ${data[i].eps} for ${data[i].title} is now out!`)
          .setImage(data[i].image)
          .setColor('Random')
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

export default AnimeAPI;
