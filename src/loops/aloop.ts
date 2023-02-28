import { TextChannel } from 'discord.js';
import Enmap from 'enmap';
import { LoopOptions, SimpleAnime } from '../../lib/interfaces/Main.js';
import AnimeAPI from '../rafts/Anime/apis/anime.js';
import { ChunkEmbeds } from '../util/Constants.js';
import BaseLoop from './BaseLoop.js';

class ALoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'animeloop',
      active: true,
      time: '0 */3 * * *',
      dev: false
    };
    super(boat, options);
  }

  async run() {
    const client = this.boat.client;

    const oldLatest = client.animealerts.get('latest') as Enmap;
    const api = new AnimeAPI();
    const newLatest = await api.getLatest(15);

    if (!newLatest) {
      return this.boat.log.error('Animeloop', 'New anime not found')
    }

    type list = { id: string, eps: number }[];

    let diff: list = [];
    let oldArr: list = [];
    let newArr: list = [];

    oldArr = Object.keys(oldLatest).map((x) => ({ id: oldLatest[x].id, eps: oldLatest[x].eps }));
    newArr = newLatest.map(x => ({ id: x.id, eps: x.eps }));

    for (let i = 0; i < newArr.length; i++) {

      const filtered = oldArr.filter(x => x.id === newArr[i].id);

      if (filtered.length === 0) {
        diff.push(newArr[i])
      } else {
        if (filtered[0].eps < newArr[i].eps) {
          diff.push(newArr[i])
        }
      }
    }

    if (diff.length) {
      const newAnime = newLatest.map(x => diff.filter(y => y.id === x.id).length ? x : null).filter(x => x !== null);

      client.animealerts.forEach(async (g, i) => {
        if (i !== 'latest') {

          const animeToPost = newAnime.filter(x => g.animes.some(i => x.id == i));
          if (animeToPost.length != 0) {

            const embeds = api.genEmbeds(animeToPost);
            const channel = await client.channels.fetch(g.channel) as TextChannel;
            let ids = [];

            for (const p in g.mentions) {
              const search = animeToPost.filter(x => x.id == p)
              if (search.length != 0) {
                ids.push(...g.mentions[p])
              }
            }

            const mentions = ids.join(' ');

            ChunkEmbeds(embeds, async (c_embeds) => {
              await channel.send({ content: mentions || null, embeds: c_embeds })
            })

            const ids_rmv = animeToPost.map(x => x.status == 'finished_airing' ? x.id : null).filter(x => x !== null);

            const ids_cur = client.animealerts.get(i).animes.filter(x => !ids_rmv.includes(x));
            client.animealerts.set(i, ids_cur, 'animes');

            const men_cur = client.animealerts.get(i).mentions;

            const filtered = Object.keys(men_cur)
              .filter(key => !ids_rmv.includes(key))
              .reduce((obj, key) => {
                obj[key] = men_cur[key];
                return obj;
              }, {});

            client.animealerts.set(i, filtered, 'mentions');

          }
        }
      })

      newLatest.forEach(anime => {
        client.animealerts.set('latest', anime, anime.id.toString())
      })
    }

    const asArray = Object.entries(client.animealerts.get('latest'));
    const filtered = asArray.filter(([_, value]: [string, SimpleAnime]) => value.status != 'finished_airing');
    const final = Object.fromEntries(filtered);
    client.animealerts.set('latest', final);

    return;
  }
}

export default ALoop;
