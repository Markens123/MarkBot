'use strict';
/* We did this without ck's help */

const Discord = require('discord.js');

const BaseCommand = require('../../BaseCommand');

class EchoCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'echo',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Echo')
      .setColor('RANDOM')
      .setDescription(args.join(' '))
      .setFooter('Made by Pilottoaster, Ethan, Markens123 without ck')
      .setAuthor(message.author.tag, message.author.displayAvatarURL());

    message.channel.send(embed);
  }
}

module.exports = EchoCommand;
