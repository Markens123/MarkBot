import { TextChannel } from 'discord.js';
import Enmap from 'enmap';
import { LoopOptions } from '../../lib/interfaces/Main.js';
import AnimeAPI from '../rafts/Anime/apis/anime.js';
import { ChunkEmbeds } from '../util/Constants.js';
import BaseLoop from './BaseLoop.js';

class ALoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'animeloop',
      active: true,
      time: '0 */3 * * *',
      dev: true
    };
    super(boat, options);
  }

  async run() {
    const client = this.boat.client;
    
    const oldLatest = client.animealerts.get('latest') as Enmap;
    const api = new AnimeAPI()
    const newLatest = await api.getLatest(15);

    if (!newLatest) {
      return this.boat.log.error('Animeloop', 'New anime not found')
    }

    let diff: { id: string, eps: number }[] = [];
    let oldArr: { id: string, eps: number }[] = [];
    let newArr: { id: string, eps: number }[] = [];

    oldArr = Object.keys(oldLatest).map((x) => ({id: oldLatest[x].id, eps: oldLatest[x].eps }));
    newArr = newLatest.map(x => ({id: x.id, eps: x.eps }));

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

    /* client.halerts.forEach(async (g, i) => {
      if (i !== 'latest') {
        const channel = await client.channels.fetch(g.channel) as TextChannel;
        channel.edit({
          topic: `Last Check: <t:${Math.round(Date.now() / 1000)}:R>`
        })
      }
    })    Will plan on doing something for this later too tired to do*/ 

    if (diff.length) {
      const newAnime = newLatest.map(x => diff.filter(y => y.id === x.id).length ? x : null).filter(x => x !== null);

      client.animealerts.forEach(async (g, i) => {
        if (i !== 'latest') {
          const animeToPost = newAnime.filter(x => g.animes.some(i => x.id == i));
          if (animeToPost.length != 0) {
            const embeds = api.genEmbeds(animeToPost);
            const channel = await client.channels.fetch(g.channel) as TextChannel;
            let ids = [];
            
            for (const p in g.mentions)  {
              const search = animeToPost.filter(x => x.id == p)
              if (search.length != 0) {
                ids.push(...g.mentions[p])
              }
            }

            const mentions = ids.join(' ');
            
            ChunkEmbeds(embeds, (c_embeds) => {
              channel.send({ content: mentions || null, embeds: c_embeds })
            })

          }
        }
      })

      newLatest.forEach(anime => {
        client.animealerts.set('latest', anime, anime.id.toString())
      })


    }

    return;

  }
}

export default ALoop;
