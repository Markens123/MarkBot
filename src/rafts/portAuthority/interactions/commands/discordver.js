'use strict';

const BaseInteraction = require('../../../BaseInteraction');
const { MessageEmbed, APIMessage } = require('discord.js');

const { ClientBuild } = require('discord-build-info-js');
const clientBuild = new ClientBuild();
var gplay = require('google-play-scraper');
var store = require('app-store-scraper');

const definition = {
  name: 'discordver',
  description: 'Checks the current version of discord for all platforms '
};

class DiscordVerInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'checktf',
      guild: '274765646217216003',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    interaction.reply(`Checking Versions...`);

    const stable = await clientBuild.getClientBuildInfo(`stable`).then(data => {
      return "Stable " + data.buildNumber + " (" + data.buildID + ")"
    });  
    const PTB = await clientBuild.getClientBuildInfo(`PTB`).then(data => {
      return "PTB " + data.buildNumber + " (" + data.buildID + ")"
    });                                  
    const canary = await clientBuild.getClientBuildInfo(`canary`).then(data => {
      return "Canary " + data.buildNumber + " (" + data.buildID + ")"
    });

    const astable = await gplay.app({appId: 'com.discord'}).then(data => {
        return "Stable " + data.version 
    });

    const istable = await store.app({id: 985746746}).then(data => {
      return "Stable " + data.version
    });
    const embed = new MessageEmbed()
    .setTitle("Current Discord Builds")
    .setColor("00FF00")
    .addField("Desktop", `${stable}\n${PTB}\n${canary}`)
    .addField("iOS", istable)
    .addField("Android", astable)
    .setTimestamp();    
    
      
    const apiMessage = APIMessage.create(interaction.webhook, null, embed).resolveData();
    this.boat.client.api.webhooks(this.boat.client.user.id, interaction.token).messages('@original').patch({ data: apiMessage.data });
  }
}

module.exports = DiscordVerInteraction;
