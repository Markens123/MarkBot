'use strict';

const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');


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
  } 
}


module.exports = AnimeAlertsCommand;
