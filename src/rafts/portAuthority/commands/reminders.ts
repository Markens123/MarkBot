import { Message, MessageEmbed } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { Paginator } from '../../../util/Constants.js'
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

  async run(message: Message) {
    const client = this.boat.client;
    const reminders = client.reminders.ensure(message.author.id, []);
    let a = [];

    if (!reminders.length) return message.channel.send('You have no active reminders!');

    for (let i = 0; i < reminders.length; i++) {
      a.push(`[${i+1}] \`${reminders[i].content.substring(0, 200)}${reminders[i].content.length > 200 ? '...' : ''}\` -> <t:${reminders[i].timestamp}:R>`)
    }

    a = chunckarr(a, 2);

    const filter = (interaction) => interaction.user.id === message.author.id;

    Paginator(message, a, 0, a.length, ({ data, offset }) => genEmbed(data, offset), { filter, idle: 15000 });
  }

}

const chunckarr = (arr: any[], chunk: number) => arr.reduce((all,one,i) => {
  const ch = Math.floor(i/chunk); 
  all[ch] = [].concat((all[ch]||[]),one); 
  return all
}, []);

function genEmbed(data: string[][], offset: number): MessageEmbed {
  if (offset >= data.length) 
    return new MessageEmbed()
      .setTitle('Error')
      .setDescription('An error has occured please try again')
      .setColor('RED');

  return new MessageEmbed()
    .setTitle('Reminders')
    .setDescription(data[offset].join('\n'))
    .setColor('NAVY');

}

export default RemindersCommand;