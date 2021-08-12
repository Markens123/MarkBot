'use strict';

import * as Discord from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

import BaseCommand from '../../BaseCommand.js';

class HelloCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'hello',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Discord.Message) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Hello there')
      .setColor('#FF0000')
      .setDescription('Beep beep')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setImage('https://i.imgur.com/SQUhP5T.gif');

    message.channel.send({embeds: [embed]});
  }
}

export default HelloCommand;
