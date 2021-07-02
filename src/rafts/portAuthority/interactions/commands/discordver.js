'use strict';

const BaseInteraction = require('../../../BaseInteraction');
const { MessageEmbed } = require('discord.js');

const fetcher = require("discord-build-fetcher-js");
let gplay = require('google-play-scraper');
let store = require('app-store-scraper');

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

  async run(interaction) {
    interaction.reply(`Checking Versions...`);

    const stable = fetcher(`stable`).then(data => {
      return "Stable " + data.buildNum + " (" + data.buildID + ")"
    });  
    const ptb = fetcher(`ptb`).then(data => {
      return "PTB " + data.buildNum + " (" + data.buildID + ")"
    });                                  
    const canary = fetcher(`canary`).then(data => {
      return "Canary " + data.buildNum + " (" + data.buildID + ")"
    });

    const astable = gplay.app({appId: 'com.discord'}).then(data => {
        return "Stable " + data.version 
    });

    const istable = store.app({id: 985746746}).then(data => {
      return "Stable " + data.version
    });
    const embed = new MessageEmbed()
    .setTitle("Current Discord Builds")
    .setColor("00FF00")
    .addField("Desktop", `${stable}\n${ptb}\n${canary}`)
    .addField("iOS", istable)
    .addField("Android", astable)
    .setTimestamp();
    
      
    interaction.editReply({embeds: [embed]});
  }
}

module.exports = DiscordVerInteraction;
