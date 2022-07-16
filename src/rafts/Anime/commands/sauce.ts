import { MessageEmbed, Message, ButtonInteraction, SnowflakeUtil, Snowflake } from 'discord.js';
import nsauce from 'node-sauce';
import BaseCommand from '../../BaseCommand.js';
import isImageUrl from 'is-image-url';
import { BoatI, CommandOptions } from '../../../../lib/interfaces/Main.js';
import { Paginator } from '../../../util/Buttons.js';
import { getMalUrl } from '../../../../../util/Constants.js';

const sauce = new nsauce(process.env.SAUCE_API_KEY);

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
    let a = [];

    if (isImageUrl(args[0])) a.push(args[0]);
    
    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType?.includes('image')) a.push(i.url);
      });
    }
    if (message.embeds.length > 0) {
      message.embeds.forEach(async i => {
        if (isImageUrl(i.url)) a.push(i.url)
        if (i.image) a.push(i.image.url)
        if (i.thumbnail) a.push(i.thumbnail.url)
      })
    }
    a = [...new Set(a)]
    
    if (a.length === 1) url = a[0];
    else if (a.length > 0) {
      const code = SnowflakeUtil.generate();
      const components = genButtons(a.length, this.boat, code);
      const filter = i => i.user.id === message.author.id && i.customId.split(':')[2] === code;

      await message.channel.send({ content: `There are ${a.length} images on that message which image would you like to get sauce for?`, components });
      
      const col = await message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 5000 }).catch(err => err) as ButtonInteraction;
      if (!(col instanceof Error)) {
        url = a[col.customId.split(':')[1]];
        col.deferUpdate();
        message.channel.messages.cache.get(col.message.id)?.delete().catch(err => err)
      } else return;
    }

    if (!url) return message.channel.send('Please provide a valid image url or image attachment!');    
    
    let out: any = await sauce(url);

    const filter = (interaction: ButtonInteraction) => interaction.user.id === message.author.id;
    
    const o = {
      boat: this.boat,
      message,
      data: out,
      length: out.length,
      callback: async ({ data, offset }) => await genEmbed(data, offset, url),
      options: { filter, idle: 15000 }
    }

    return Paginator(o)
  }
}

async function genEmbed(data, offset, ogimg) {
  const info = data[offset];
  const embed = new MessageEmbed();
  const encurl = encodeURIComponent(ogimg);

  if (info.ext_urls.length && !info.ext_urls.some(l => l.includes('myanimelist.net'))) {
    for (let i = 0; i < info.ext_urls.length; i++) {
      let url = await getMalUrl(info.ext_urls[i]);
      if (url) {
        info.ext_urls.push(url);
      }
    }
  }

  if (info.source) embed.addField('Title', info.source);
  if (info.est_time) embed.addField('Estimated Time', info.est_time);
  if (info.ext_urls) embed.addField('External URLS', info.ext_urls.join('\n'));


  return embed
    .setTitle('Sauce found')
    .setImage(info.thumbnail)
    .addField('Similarity', info.similarity)
    .addField('Image Search', `
    [Google](https://www.google.com/searchbyimage?image_url=${encurl})\n[Yandex](https://yandex.com/images/search?rpt=imageview&url=${encurl})`
    )
    .setFooter({ text: `${offset + 1}/${data.length} ${info.year ? `• ${info.year}` : ''}` });
}

function genButtons(num: number, boat: BoatI, code: Snowflake) {
  if (num > 10) {
    boat.log.warn('Sauce interaction/Gen Buttons function', 'The provided number was over 10');
    num = 10;
  }

  const a = [];

  for (let i = 0; i < num; i++) {
    a.push({
      type: 'BUTTON',
      label: i + 1,
      customId: `collector:${i}:${code}`,
      style: 'PRIMARY',
      emoji: null,
      url: null,
      disabled: false,
    });
  }
  // @ts-expect-error chunk isn't defined so ye
  return a.chunkc(5);
}


export default SauceCommand;
