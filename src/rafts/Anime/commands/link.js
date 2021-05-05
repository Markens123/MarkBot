'use strict';
/* We did this without ck's help */

const Discord = require('discord.js');
const axios = require('axios');
const BaseCommand = require('../../BaseCommand');


class LinkCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'link',
      owner: false,
      dms: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let client = this.boat.client;
    if (args.length < 2) {
      let embed = new Discord.MessageEmbed()
      .setDescription(`To link your account you must authorize it first [here](${process.env.MAL_AUTH_LINK}) then send the link command!`)
      .setColor('FF0000');
      return message.channel.send(embed)
    }
    
    const out = await this.raft.apis.oauth.getToken(args[0]).catch(err => {this.boat.log.verbose(module, `Error getting token ${err}`)});

    if (!out.access_token) return message.channel.send('An error has occured please relink your account and send the new command!')

    client.maldata.set(message.author.id, out.access_token, 'AToken');
    client.maldata.set(message.author.id, out.refresh_token, 'RToken');
    client.maldata.set(message.author.id, Date.now() + (out.expires_in * 1000), 'EXPD');
    message.channel.send('Successful linked account!')
  } 
}


module.exports = LinkCommand;
