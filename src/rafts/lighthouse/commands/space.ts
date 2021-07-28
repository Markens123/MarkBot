'use strict';

import * as Discord from 'discord.js';
import BaseCommand from '../../BaseCommand.js';

class SpaceCommand extends BaseCommand {
  constructor(raft) {
    const options = {
      name: 'space',
      owner: false,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Discord.Message) {
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
    message.channel.send({embeds: [embed]});
  }
}

export default SpaceCommand;
