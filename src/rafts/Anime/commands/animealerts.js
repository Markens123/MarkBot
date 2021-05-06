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
    let myFilter = {
      idMal: parseInt(args[0])
    };
    const s = await Anilist.searchEntry.anime(null, myFilter)
    if (s.media.length === 0) return message.channel.send('An anime with that id does not exist!')
    const anime = await Anilist.media.anime(s.media[0].id)

  } 
}


module.exports = AnimeAlertsCommand;
