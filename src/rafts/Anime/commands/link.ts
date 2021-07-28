'use strict';

import * as Discord from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class LinkCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'link',
      owner: false,
      dms: 'only',
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Discord.Message, args: any) {
    let client = this.boat.client;
    let state = '';
    if (client.maldata.has('states', message.author.id)) state = client.maldata.get('states', message.author.id)
    else {
      state = makeid(10)
      client.maldata.set('states', state, message.author.id)
    }

    if (args.length < 2) {
      let embed = new Discord.MessageEmbed()
      .setDescription(`To link your account you must authorize it first [here](${process.env.MAL_AUTH_LINK}&state=${state}) then send the link command!`)
      .setColor('#FF0000');
      return message.channel.send({embeds: [embed]})
    }
    
    const out = await this.raft.apis.oauth.getToken(args[0]).catch(err => {this.boat.log.verbose(module, `Error getting token ${err}`)});

    if (!out.access_token) return message.channel.send('An error has occured please relink your account and send the new command!')

    client.maldata.set(message.author.id, out.access_token, 'AToken');
    client.maldata.set(message.author.id, out.refresh_token, 'RToken');
    client.maldata.set(message.author.id, Date.now() + (out.expires_in * 1000), 'EXPD');
    message.channel.send('Successful linked account!')
  } 
}

function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

export default LinkCommand;
