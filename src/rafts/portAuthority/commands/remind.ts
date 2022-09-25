import { Message } from 'discord.js';
import parse from 'parse-duration';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class RemindCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'remind',
      owner: false,
      enabled: true,
      aliases: ['r'],
      args: [
          {
            name: 'time',
            type: 'string',
            required: true,
            validation: ({ arg }) => parse(arg),
            error: 'Please provide a valid duration!'
          },
          {
            name: 'content',
            type: 'string',
            index: Infinity,
            required: true,
          },
          {
            name: 'dms',
            type: 'flag',
            default: false,
            flags: ['--dm', '-d'],
          }
      ],
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    const client = this.boat.client;
    const time = parse(args.time);
    const timestamp = Math.round((Date.now() + time)/1000);
        
    const resp = genResp(message, args.content)
    const destination = args.dms ? await message.author.createDM() : message.channel
    
    function sendResp() {
      destination.send(resp)
    }

    const timeout = setTimeout(sendResp, time);
    const id = timeout[Symbol.toPrimitive]();

    setTimeout(() => {
      const arr = client.reminders.fetch(message.author.id)
      const newarr = arr.filter(reminder => reminder.id !== id)
      client.reminders.set(message.author.id, newarr)
    }, time)

    client.reminders.ensure(message.author.id, [])
    client.reminders.push(message.author.id, 
    {
      content: args.content,
      timestamp,
      id
    })

    message.channel.send({ content: `I'll remind you for that <t:${timestamp}:R>${args.dms ? ' be sure to have your dms open!' : ''}` });
 
  } 
}


function genResp(message: Message, content: string) {
  return `
  **Reminder delivery:**\nTo: ${message.author.toString()}
  \nJump Link:\n${message.url}
  \nReminder:
  \n\`\`\`${content}\`\`\``
}

export default RemindCommand;