'use strict';

const Discord = require('discord.js');

const BaseCommand = require('../../BaseCommand');

class HelloCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'hello',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Hello there')
      .setColor('#FF0000')
      .setDescription('Beep beep')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setImage('https://i.imgur.com/SQUhP5T.gif');

    message.channel.send(embed);
  }
}

module.exports = HelloCommand;
