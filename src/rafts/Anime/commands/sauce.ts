import { MessageEmbed, Message, ButtonInteraction } from 'discord.js';
import nsauce from 'node-sauce';
import BaseCommand from '../../BaseCommand.js';
import isImageUrl from 'is-image-url';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { Paginator } from '../../../util/Pagination.js';
let sauce = new nsauce(process.env.SAUCE_API_KEY);

class SauceCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'sauce',
      owner: false,
      dms: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    let url = '';    
    if (message.attachments.size > 0) url = message.attachments.first().url
    else if (message.embeds.length > 0 && message.embeds[0].type == 'image') url = message.embeds[0].thumbnail.url
    else if (args && isImageUrl(args[0])) url = args[0]
    if (!url) return message.channel.send('Please provide a valid image url or image attachment!')
    
    let out: any = await sauce(url);

    const filter = (interaction: ButtonInteraction) => interaction.user.id === message.author.id;
    
    const o = {
      boat: this.boat,
      message,
      data: out,
      length: out.length,
      callback: ({ data, offset }) => genEmbed(data, offset),
      options: { filter, idle: 15000 }
    }

    return Paginator(o)
  }
}

function genEmbed(data, offset) {
  let info = data[offset]
  
  const embed = new MessageEmbed();

  if (info.source) embed.addField('Title', info.source);
  embed.setTitle('Sauce found')
  .setImage(info.thumbnail)
  .addField('Similarity', info.similarity)
  .setFooter(`${offset + 1}/${data.length} ${info.year ? `• ${info.year}` : ''}`);

  if (info.est_time) embed.addField('Estimated Time', info.est_time);
  if (info.ext_urls) embed.addField('External URLS', info.ext_urls.join('\n'));

  return embed;
}



export default SauceCommand;
