'use strict';
/* We did this without ck's help */

import * as Discord from 'discord.js';

import BaseCommand from  '../../BaseCommand.js';

class EchoCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'echo',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Discord.Message, args: any) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Echo')
      .setColor('RANDOM')
      .setDescription(args.join(' '))
      .setFooter('Made by Pilottoaster, Ethan, Markens123 without ck')
      .setAuthor(message.author.tag, message.author.displayAvatarURL());

    message.channel.send({embeds: [embed]});
  }
}

export default EchoCommand;
