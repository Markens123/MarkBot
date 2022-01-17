import got from 'got';
import * as cheerio from 'cheerio';
import { HAnime } from '../../../../lib/interfaces/Main'
import { MessageEmbed } from 'discord.js';

class AnimeAPI {
  url: string = 'https://hanime.tv';
  api_url: string = 'https://search.htv-services.com/';

  async getLatest(count: number = 5): Promise<HAnime[]> {

    const $ = cheerio.load(await this.getHTML());

    let arr = [];

    let farr = [];

    const list = $('div.htv-carousel__slider').children().children();

    list.each((i, e) => {
      arr.push($(e).attr('alt'))
    });

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

  genEmbeds(data: HAnime[]): MessageEmbed[] {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(new MessageEmbed().setTitle(data[i].name).setURL(this.toUrl(data[i].id)).setImage(data[i].cover_url).setFooter(shorten(data[i].tags.join(' • '), 2048, ' • ')).setColor('RANDOM'))
    }
    return arr;
  }

}

function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export default AnimeAPI;
