import { TextChannel } from 'discord.js';
import { HAnime, LoopOptions } from '../../lib/interfaces/Main.js';
import HAnimeAPI from '../rafts/Anime/apis/hen.js';
import BaseLoop from './BaseLoop.js';

class HLoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'hentailoop',
      active: true,
      time: '*/32 * * * *',
      dev: false
    };
    super(boat, options);
  }

  async run() {
    const client = this.boat.client;
    
    const oldLatest = client.halerts.get('latest') as HAnime[];
    const api = new HAnimeAPI()
    const newLatest = await api.getLatest(10);
    let diff = [];
    let oldArr = [];
    let newArr = [];

    oldArr = oldLatest.map(x => x.id);
    newArr = newLatest.map(x => x.id);

    for (let i = 0; i < newArr.length; i++) {
      if (!oldArr.includes(newArr[i])) {
        diff.push((newArr[i]))
      }
    }

    client.halerts.forEach(async (g, i) => {
      if (i !== 'latest') {
        const channel = await client.channels.fetch(g.channel) as TextChannel;
        channel.edit({
          topic: `Last Check: <t:${Math.round(Date.now() / 1000)}:R>`
        })
      }
    })    

    if (diff.length) {
      const newAnime = newLatest.map(x => diff.includes(x.id) ? x : null).filter(x => x !== null);

      const embeds = api.genEmbeds(newAnime);

      client.halerts.forEach(async (g, i) => {
        if (i !== 'latest') {
          const channel = await client.channels.fetch(g.channel) as TextChannel;
          channel.send({ content: g.mentions?.length ? g.mentions.join(' ') : null, embeds })
        }
      })

      client.halerts.set('latest', newLatest);

    }
  }
}

export default HLoop;
