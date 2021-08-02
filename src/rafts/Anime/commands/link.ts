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

    let embed = new Discord.MessageEmbed()
    .setDescription(`To link your account you must authorize it first [here](${process.env.MAL_AUTH_LINK}&state=${state}) then send the link command!`)
    .setColor('#FF0000');
    return message.channel.send({embeds: [embed]});
  } 
}

function makeid(length: number) {
  let result = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

export default LinkCommand;
