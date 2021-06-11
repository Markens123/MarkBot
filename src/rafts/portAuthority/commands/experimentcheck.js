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
    if (!experiments.includes(args[0].toLowerCase()) && args[0].toLowerCase() !== 'all') return message.channel.send('Error you must send a valid experiment!');
    let exp = args[0].toLowerCase();
    let user;
    if (message.mentions.members.size > 0) user = message.mentions.members.first().id
    else if (args[1]) user = args[1]    
    else user = message.author.id

    let u = await client.users.fetch(user).then(myUser => {
      return myUser
    }).catch(error => {return false})

    if (!u && args[1].toLowerCase() !== 'all') return message.channel.send('Invalid user!');
    let position;
    let text = '';
    if (args[1] == 'all') await message.guild.members.fetch(); 
    let ua = u ? [u] : message.guild.members.cache.map(u => u.user.bot === false ? u : undefined).filter(e => e !== undefined)
    
    for (let j = 0; j < ua.length; j++) {
      if (exp === 'all') {
        for (let i = 0; i < experiments.length; i++) {
          position = murmur3(`${experiments[i]}:${ua[j].id}`) % 1e4;
          text += `The position of ${ua[j].toString()} for experiment **${experiments[i]}** is #${position}\n\n`;   
        }
      } else {
        position = murmur3(`${exp}:${ua[j].id}`) % 1e4;
        text += `The position of ${ua[j].toString()} for experiment **${exp}** is #${position}\n\n`;
      } 
    }  
    let embed = new Discord.MessageEmbed()
    .setTitle('Experiment position')
    .setDescription(text);
    return message.channel.send(embed);

  }
}

module.exports = ExperimentCheckCommand;
