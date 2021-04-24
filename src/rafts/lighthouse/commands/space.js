'use strict';

const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');

class SpaceCommand extends BaseCommand {
  constructor(raft) {
    const options = {
      name: 'space',
      owner: false,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message) {
    const stars = await this.raft.apis.nasa.getAPOD();
    // Message.channel.send(`${stars.data.url}`)
    let embed = new Discord.MessageEmbed()
      .setTitle(`${stars.title}`)
      .setURL('https://apod.nasa.gov/')
      .setColor('#0B3D91')
      .setDescription(`${stars.explanation}`)
      .setImage(`${stars.url}`)
      .addField('Date', `${stars.date}`)
      .setTimestamp()
      .setFooter('nasa.gov', 'https://cdn.discordapp.com/app-assets/811111315988283413/811114038036529152.png');
    message.channel.send(embed);
  }
}

module.exports = SpaceCommand;
