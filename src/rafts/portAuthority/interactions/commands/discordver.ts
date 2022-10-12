import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import store from 'app-store-scraper';
import gplay from 'google-play-scraper';
import { discVer } from '../../../../util/Constants.js';

const definition = {
  name: 'discordver',
  description: 'Checks the current version of discord for all platforms '
};

class DiscordVerInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'discordver',
      guild: ['274765646217216003', '816098833054302208'],
      enabled: true,
      definition,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    interaction.reply(`Checking Versions...`);

    const stable = await discVer(`stable`).then(data => {
      return `Stable ${data.buildNum} (${data.buildID})`
    });
    const ptb = await discVer(`ptb`).then(data => {
      return `PTB ${data.buildNum} (${data.buildID})`
    });
    const canary = await discVer(`canary`).then(data => {
      return `Canary ${data.buildNum} (${data.buildID})`
    });

    const astable = await gplay.app({ appId: 'com.discord' }).then(data => {
      return `Stable ${data.version.replace('- Stable', '')}`
    });
    const istable = await store.app({ id: 985746746 }).then(data => {
      return `Stable ${data.version}`
    });

    const embed = new EmbedBuilder()
      .setTitle('Current Discord Builds')
      .setColor('#00FF00')
      .addFields([
        { name: 'Desktop', value: `${stable}\n${ptb}\n${canary}` },
        { name: 'iOS', value: istable },
        { name: 'Android', value: astable }
      ])
      .setTimestamp()

    interaction.editReply({ content: null, embeds: [embed] });
  }
}

export default DiscordVerInteraction;
