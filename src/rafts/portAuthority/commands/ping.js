'use strict';
/* We did this without ck's help */

const Discord = require('discord.js');

const BaseCommand = require('../../BaseCommand');

class PingCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'ping',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - message.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new Discord.MessageEmbed()
      .setTitle('Pong')
      .setColor('#F1C40F')
      .setDescription(description)
      .setFooter('Made by Pilot, Ethan, Markens without ck');

    message.channel.send({embeds: [embed]}).then(msg => {
      msg.edit(embed.setDescription(`${description} API latency ${msg.createdTimestamp - message.createdTimestamp}ms.`));
    });
  }
}

module.exports = PingCommand;
