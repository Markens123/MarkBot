import { Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

import BaseCommand from  '../../BaseCommand.js';

class DelReminderCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'delreminder',
      owner: false,
      enabled: true,
      aliases: ['dr', 'deletereminder'],
      args: 
      [
        {
          name: 'rid',
          type: 'integer',
          validation: ({ arg }) => !isNaN(arg),
          error: 'Please provide a valid number!',
          required: true,
        },
      ],
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    const client = this.boat.client;
    const reminders = client.reminders.ensure(message.author.id, []);

    if (!reminders[args.rid-1]) return message.channel.send('There is no reminder with that id!');

    const respmsg = await message.channel.send("Are you sure that you want to delete that reminder? If so reply with 'yes'.")
    const filter = (m) => m.author.id === message.author.id;

    const collector = message.channel.createMessageCollector({filter, time: 6000 });

    collector.on('collect', (msg) => {
      if (msg.content === 'yes') {
        clearTimeout(reminders[args.rid-1].id);
        const arr = client.reminders.fetch(message.author.id);
        const newarr = arr.filter(reminder => reminder.id !== reminders[args.rid-1].id);
        client.reminders.set(message.author.id, newarr);
        message.channel.messages.cache.get(respmsg.id)?.delete();
        if (msg.deletable) message.channel.messages.cache.get(msg.id)?.delete();
        message.channel.send('The reminder has been canceled!')
      } else {
        message.channel.send('Reminder deletion cancled!');
        message.channel.messages.cache.get(respmsg.id)?.delete()
      }
      collector.stop()
    })



  }
}

export default DelReminderCommand;