import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

import fetcher from 'discord-build-fetcher-js';
//import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const definition = {
  name: 'discordver',
  description: 'Checks the current version of discord for all platforms '
};

class DiscordVerInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'discordver',
      guild: '274765646217216003',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    interaction.reply(`Checking Versions...`);

    const stable = await fetcher(`stable`).then(data => {
      return "Stable " + data.buildNum + " (" + data.buildID + ")"
    });  
    const ptb = await fetcher(`ptb`).then(data => {
      return "PTB " + data.buildNum + " (" + data.buildID + ")"
    });                                  
    const canary = await fetcher(`canary`).then(data => {
      return "Canary " + data.buildNum + " (" + data.buildID + ")"
    });

/*    const astable = await gplay.app({appId: 'com.discord'}).then(data => {
        return "Stable " + data.version 
    });*/

    const istable = await store.app({id: 985746746}).then(data => {
      return "Stable " + data.version
    });
    const embed = new EmbedBuilder()
    .setTitle("Current Discord Builds")
    .setColor('#00FF00')
    .addFields([
      {name: "Desktop", value: `${stable}\n${ptb}\n${canary}`},
      {name: "iOS", value: istable}
    ])
    .setTimestamp()
    //.addField("Android", astable);
    
      
    interaction.editReply({ content: null, embeds: [embed] });
  }
}

export default DiscordVerInteraction;
