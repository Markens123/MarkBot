import * as cheerio from 'cheerio';
import { EmbedBuilder } from 'discord.js';
import got from 'got';
import { AnimeI, SimpleAnime } from '../../../../lib/interfaces/Main';
import { shorten } from '../../../util/Constants.js';

class AnimeAPI {
  private url: string = 'https://gogoanime.news/recent-release-anime';
  private api_url: string = 'https://api.myanimelist.net/v2/anime';


  async getLatest(count: number = 20): Promise<SimpleAnime[]> {

    if (!process.env.MAL_CLIENT_ID) {
      return null
    }

    const $ = cheerio.load(await this.getHTML());

    let arr: { title: string, episode: number, url: string }[] = [];

    let farr = [];

    const list = $('#wrapper_bg > section > div > div.page_content > ul').children();

    list.each((i, e) => {
      let ii = i + 1;
      const title = $(e).find(`li:nth-child(${ii}) > div.name > a`).attr('title') || $(e).find(`li:nth-child(${ii}) > div.name > a > h4`).text();
      if (title) {
        arr.push({
          title,
          episode: parseEps($(e).find(`li:nth-child(${ii}) > p`).text().trim()),
          url: `https://animension.to/search?search_text=${encodeURI(title)}`
        })
      }
    });

    for (let i = 0; i < arr.length; i++) {
      const anime = await this.getRawVideoData(arr[i].title)
      if (anime) {
        const simple = this.toSimple(anime, arr[i].episode, arr[i].url);

        farr.push(simple);
      }
    }

    return farr.slice(0, count);
  }


  async getHTML(): Promise<string> {
    const { body } = await got.get(this.url);
    return body;
  }

  toSimple(og: AnimeI, eps: number | null, url?: string): SimpleAnime {
    return {
      id: og.id.toString(),
      title: og.title,
      mal_url: `https://myanimelist.net/anime/${og.id}`,
      url,
      image: og.main_picture.medium,
      eps,
      alt_titles: Object.values(og.alternative_titles)?.flat() ?? [],
      genres: og.genres?.map(x => x.name) ?? [],
      type: og.media_type,
      status: og.status
    };
  }

  async getRawVideoData(title: string): Promise<AnimeI | undefined> {
    const searchParams = new URLSearchParams([
      ['q', title.substring(0, 30)],
      ['limit', '10'],
      ['fields', 'id,title,main_picture,media_type,genres,alternative_titles,status'],
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

    const filtered = animes.filter(anime => {
      const titles = [anime.title.toLowerCase(), ...Object.values(anime.alternative_titles).flat().map(x => x.toLowerCase())];
      return titles.includes(title.toLowerCase())
    });

    if (animes?.length === 0) return undefined
    else if (filtered.length != 0) return filtered[0]
    else return animes[0]
  }

  async search(title: string, count: number = 10): Promise<AnimeI[] | undefined> {
    const searchParams = new URLSearchParams([
      ['q', title.substring(0, 30)],
      ['limit', '10'],
      ['fields', 'id,title,main_picture,media_type,genres,alternative_titles,status'],
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

    const filtered = animes.filter(anime => {
      const titles = [anime.title.toLowerCase(), ...Object.values(anime.alternative_titles).flat().map(x => x.toLowerCase())];
      return titles.includes(title.toLowerCase())
    });

    if (animes?.length === 0) return undefined
    else if (filtered.length != 0) return filtered.slice(0, count)
    else return animes.slice(0, count)
  }

  async getAnime(id: string): Promise<AnimeI | undefined> {
    const searchParams = new URLSearchParams([
      ['fields', 'id,title,main_picture,media_type,genres,alternative_titles,status'],
      ['nsfw', 'true'],
    ]);

    const { body } = await got(`${this.api_url}/${id}`, {
      //@ts-expect-error typescript is being dumb :P
      searchParams,
      headers: {
        "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
      }
    }).catch(_ => { return { body: null } });

    if (!body) return undefined;

    return JSON.parse(body) as AnimeI;
  }

  genEmbeds(data: SimpleAnime[]): EmbedBuilder[] {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(
        new EmbedBuilder()
          .setTitle(`New Episode for ${data[i].alt_titles[0] || data[i].title}`)
          .setDescription(`[Episode ${data[i].eps}](${data[i].url})\n[MAL Url](${data[i].mal_url})`)
          .setImage(data[i].image)
          .setColor('Random')
          .setFooter({ text: `${data[i].type.toUpperCase()} • ${shorten(data[i].genres.join(' • '), 2000, ' • ')}` })
      )
    }
    return arr;
  }

  genDemoEmbed(data: SimpleAnime): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(data.title)
      .setDescription(`[MAL Url](${data.mal_url})`)
      .setImage(data.image)
      .setColor('Random')
      .setFooter({ text: `${data.type.toUpperCase()} • ${shorten(data.genres.join(' • '), 2000, ' • ')}` })
    }
}

function parseEps(str: string): number {
  const ep = str.replace('Episode: ', '');
  const num = parseInt(ep);

  if (!num) return 1
  else return num
}

export default AnimeAPI;
