'use strict';
/* We did this without ck's help */

import * as Discord from 'discord.js';

import BaseCommand from '../../BaseCommand.js';

class PingCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'ping',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Discord.Message) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - message.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new Discord.MessageEmbed()
      .setTitle('Pong')
      .setColor('#F1C40F')
      .setDescription(description)
      .setFooter('Made by Pilot, Ethan, Markens without ck');

    message.channel.send({embeds: [embed]}).then(msg => {
      msg.edit({embeds: [embed.setDescription(`${description} API latency ${msg.createdTimestamp - message.createdTimestamp}ms.`)]});
    });
  }
}

export default PingCommand;
