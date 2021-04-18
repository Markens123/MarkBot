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
    
    const url = `https://myanimelist.net/v1/oauth2/token`
    const params = new URLSearchParams()
    params.append('client_id', process.env.MAL_CLIENT_ID);
    params.append('client_secret', process.env.MAL_CLIENT_SECRET);
    params.append('code', args[0]);
    params.append('code_verifier', process.env.MAL_CODE_VERIFIER);
    params.append('grant_type', 'authorization_code');
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const out = await axios.post(url, params, config)//.catch(error => message.channel.send('An error has occured please relink your account and send the new command given!'))
    client.maldata.set(message.author.id, out.data.access_token, 'AToken');
    client.maldata.set(message.author.id, out.data.refresh_token, 'RToken');
    client.maldata.set(message.author.id, Date.now() + (out.data.expires_in * 1000), 'EXPD');
    message.channel.send('Successful linked account!')
  } 
}


module.exports = LinkCommand;
