'use strict';

const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');
const anilist = require('anilist-node');

class AnimeAlertsCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'animealerts',
      owner: false,
      permissions: 'MANAGE_CHANNELS',
      aliases: ['aa', 'animea', 'aalerts'],
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let client = this.boat.client;
    const Anilist = new anilist();
    if (!args) return message.channel.send(`Usage: ${this.boat.prefix + this.name} <anime id> <channel id/mention> (role id/mention to ping)`)
    let channel;
    if (message.mentions.channels.size > 0) channel = message.mentions.channels.first().id
    else if (args.length > 1) channel = args[1]    
    else return message.channel.send(`Usage: ${this.boat.prefix + this.name} <anime id> <channel id/mention> (role id/mention to ping)`)

    //if (args.length < 2) return message.channel.send(`Usage: ${this.boat.prefix + this.name} <anime id> <channel id/mention> (role id/mention to ping)`)
    let myFilter = {
      idMal: parseInt(args[0])
    };
    const s = await Anilist.searchEntry.anime(null, myFilter)
    if (s.media.length === 0) return message.channel.send('An anime with that id does not exist!')
    const anime = await Anilist.media.anime(s.media[0].id)

    console.log(anime)
     
    if (!client.epdata.has(parseInt(args[0]))) {
      client.epdata.set(parseInt(args[0]), anime.nextAiringEpisode.airingAt, 'NextAir')
      client.epdata.set(parseInt(args[0]), anime.nextAiringEpisode.episode, 'NextEP')
      client.epdata.set(parseInt(args[0]), args[1], `Channels`)
      client.epdata.set('channels', parseInt(args[0]), channel)
    }




  } 
}


module.exports = AnimeAlertsCommand;
