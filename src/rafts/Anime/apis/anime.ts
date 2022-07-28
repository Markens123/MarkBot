import got from 'got';
import * as cheerio from 'cheerio';
import { HAnime } from '../../../../lib/interfaces/Main'
import { EmbedBuilder } from 'discord.js';

class AnimeAPI {
  url: string = 'https://animixplay.to/';
  api_url: string = 'https://search.htv-services.com/';

  async getLatest(count: number = 20): Promise<any> {

    const $ = cheerio.load(await this.getHTML());

    let arr = [];

    let farr = [];

    const list = $('#resultplace > ul').children();

    list.each((i, e) => {      
      arr.push({title: $(e).children().attr('title'), episode: parseEps($(e).children().attr('href'))})
    });

    console.log(arr)
    return;

    for (let i = 0; i < arr.length; i++) {
      const data = await this.getRawVideoData(arr[i]);
      if (data) farr.push(data);
    }
    
    return farr.slice(0, count)
  }


  async getHTML(): Promise<string> {
    const { body } = await got.get(this.url);
    return body;
  }

  async getRawVideoData(title: string): Promise<HAnime | undefined> {
    
    const { body } = await got.post(this.api_url, {
      json: {
        search_text: title,
        tags_mode: 'AND',
        brands: [],
        blacklist: [],
        tags: [],
        order_by: 'created_at_unix',
        ordering: 'desc'
      }
    }); 

    const anime = JSON.parse(JSON.parse(body).hits)[0];

    if (!anime) return undefined;
    else return anime as HAnime;
  }

  toUrl(id: number | string): string {
    return `${this.url}/videos/hentai/${id}`
  }

  genEmbeds(data: HAnime[]): EmbedBuilder[] {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(new EmbedBuilder().setTitle(data[i].name).setURL(this.toUrl(data[i].id)).setImage(data[i].cover_url).setFooter({ text: shorten(data[i].tags.join(' • '), 2048, ' • ') }).setColor('Random'))
    }
    return arr;
  }

}

function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

function parseEps(str: string): number {
  let last = str.split('/')[3];

  if (!last) return 1
  else return parseInt(last.replace('ep', ''))
}

export default AnimeAPI;
