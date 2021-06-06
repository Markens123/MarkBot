'use strict';

const Discord = require('discord.js');
const { experiments } = require('../../../util/constants');
const BaseCommand = require('../../BaseCommand');
const { murmur3 } = require('murmurhash-js');

class ExperimentCheckCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'experimentcheck',
      owner: true,
      enabled: true,
      aliases: ['ec', 'expc']
    };
    super(boat, options);
  }

  async run(message, args) {
    const client = this.boat.client;
    if (!experiments.includes(args[0]) && args[0] !== 'all') return message.channel.send('Error you must send a valid experiment!');
    let exp = args[0].toLowerCase();
    let user;
    if (message.mentions.members.size > 0) user = message.mentions.members.first().id
    else if (args[1]) user = args[1]    
    else user = message.author.id

    let u = await client.users.fetch(user).then(myUser => {
      return myUser
    }).catch(error => {return false})

    if (!u) return message.channel.send('Invalid user!');
    let position;
    let text = '';
    
    if (exp === 'all') {
      for (let i = 0; i < experiments.length; i++) {
        position = murmur3(`${experiments[i]}:${u.id}`) % 1e4;
        text += `\nThe position of ${u.toString()} for experiment **${experiments[i]}** is #${position}`;   
      }
    } else {
      position = murmur3(`${exp}:${u.id}`) % 1e4;
      text = `The position of ${u.toString()} for experiment **${exp}** is #${position}`;
    } 
    let embed = new Discord.MessageEmbed()
    .setTitle('Experiment position')
    .setDescription(text)
    .setAuthor(u.tag, u.displayAvatarURL());
    return message.channel.send(embed);

  }
}

module.exports = ExperimentCheckCommand;
