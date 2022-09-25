import { EmbedBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class PingCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'ping',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - message.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new EmbedBuilder()
      .setTitle('Pong')
      .setColor('#F1C40F')
      .setDescription(description)
      .setFooter({text: 'Made by Pilot, Ethan, Markens without ck'});

    message.channel.send({embeds: [embed]}).then(msg => {
      msg.edit({embeds: [embed.setDescription(`${description} API latency ${msg.createdTimestamp - message.createdTimestamp}ms.`)]});
    });
  }
}

export default PingCommand;
