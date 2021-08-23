import { Message, MessageEmbed } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

import BaseCommand from  '../../BaseCommand.js';

class RemindersCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'reminders',
      owner: false,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message) {
    const client = this.boat.client;
    const reminders = client.reminders.ensure(message.author.id, []);
    const a = [];

    if (!reminders.length) return message.channel.send('You have no active reminders!');

    for (let i = 0; i < reminders.length; i++) {
      a.push(`[${i+1}] \`${reminders[i].content.substring(0, 200)}${reminders[i].content.length > 200 ? '...' : ''}\` -> <t:${reminders[i].timestamp}:R>`)
    }

    const embed = new MessageEmbed()
      .setTitle('Reminders')
      .setDescription(a.join('\n')) 

    message.channel.send({ embeds: [embed] });
  }

}

export default RemindersCommand;