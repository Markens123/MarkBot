import { Channel, EmbedBuilder, TextBasedChannel, TextChannel } from 'discord.js';
import Enmap from 'enmap';
import { DiscordBuild, LoopOptions } from '../../lib/interfaces/Main.js';
import AnimeAPI from '../rafts/Anime/apis/anime.js';
import { ChunkEmbeds, discVer } from '../util/Constants.js';
import BaseLoop from './BaseLoop.js';

class DLoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'discordloop',
      active: true,
      time: 30,
    };
    super(boat, options);
  }

  async run() {
    const client = this.boat.client;
    const cstable = await discVer('stable');
    const cptb = await discVer('ptb');
    const ccanary = await discVer('canary');
    const ostable = client.dalerts.get('latest', 'stable') as DiscordBuild;
    const optb = client.dalerts.get('latest', 'ptb') as DiscordBuild;
    const ocanary = client.dalerts.get('latest', 'canary') as DiscordBuild;

    const diff = [];

    if (cstable.buildHash !== ostable?.buildHash) diff.push('stable');
    if (cptb.buildHash !== optb?.buildHash) diff.push('ptb');
    if (ccanary.buildHash !== ocanary?.buildHash) diff.push('canary');

    diff.forEach(x => {
      let current: DiscordBuild;
      if (x === 'stable') current = cstable;
      if (x === 'ptb') current = cptb;
      if (x === 'canary') current = ccanary;

      const embed = new EmbedBuilder()
        .setTitle(`New ${this.text[x]} Update`)
        .addFields([
          {
            name: 'Build Number',
            value: current.buildNum,
            inline: true
          },
          {
            name: 'Build ID',
            value: current.buildID,
            inline: true
          },
          {
            name: 'Build Hash',
            value: current.buildHash,
            inline: false
          }                        
        ])

        client.dalerts.forEach(async (g, i) => {
          if (i !== 'latest') {
            if (g[x]) {
              const channel = await client.channels.fetch(g[x]).catch(err => false) as TextBasedChannel | null;
              if (channel) {
                channel.send({ embeds: [embed] })
              }
            }
          }
        })
    })

    client.dalerts.set('latest', cstable, 'stable')
    client.dalerts.set('latest', cptb, 'ptb')
    client.dalerts.set('latest', ccanary, 'canary')
  }

  text = {
    stable: 'Stable',
    canary: 'Canary',
    ptb: 'PTB'
  }
}

export default DLoop;
