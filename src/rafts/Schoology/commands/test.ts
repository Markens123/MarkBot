import { Message, MessageEmbed, MessageOptions, TextBasedChannels } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import pkg from 'node-ical'
const { async: cal } = pkg;
import BaseCommand from  '../../BaseCommand.js';

class TestCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'test',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    const client = this.boat.client;
    const channel = client.channels.cache.get('883882042532700190') as TextBasedChannels;
    const events = await cal.fromURL('https://ercsd.schoology.com/calendar/feed/ical/1605998213/5efe9de00026b19b163600e2106f3a17/ical.ics');
    const a: MessageOptions[] = []
    
    for (const [key, value] of Object.entries(events)) {
      if (!client.schoold.has(key)) {
        //@ts-expect-error
        const url = value.url.val
        const deadline = Date.parse(value.end.toString())
        const description = value.description.toString().replace(` - Link: ${url}`, '').concat(`\nAssignment Link: ${url}\nDue <t:${Math.round(deadline/1000)}:R>`)
        const title = value.summary

        client.schoold.set(key, {
          url,
          deadline,
          title: (title as string),
          description,
        })

        const embed = new MessageEmbed()
          .setTitle('New Assignment')
          //@ts-expect-error
          .addField(title, description)
          .setColor('AQUA')
          .setURL(url);

        const menu = this.raft.interactions.selectMenuComponents.get('SELECT_CLASS').definition(key)

        a.push({
          embeds: [embed],
          components: [menu],
          content: '<@396726969544343554>'
        })
      }
    }    
    for (let i = 0; i < a.length; i++) {
      const options = a[i];
      channel.send(options)
    }
    

  }
}
 
export default TestCommand;