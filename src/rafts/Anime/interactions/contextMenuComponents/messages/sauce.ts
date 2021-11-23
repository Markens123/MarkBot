import { MessageActionRow, ButtonInteraction, Message, MessageEmbed, SnowflakeUtil, Snowflake, ContextMenuInteraction } from 'discord.js';
import nsauce from 'node-sauce';
const sauce = new nsauce(process.env.SAUCE_API_KEY);
import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import { InteractionPaginator } from '../../../../../util/Pagination.js';
class SauceInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'Sauce',
      enabled: true,
      type: 'MESSAGE',
    };
    super(raft, info);
  }

  async run(interaction: ContextMenuInteraction) {
    const message = interaction.options.getMessage('message') as Message;
    let url = '';
    let a = [];

    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType?.includes('image')) a.push(i.url);
      });
    }
    if (message.embeds.length > 0) {
      message.embeds.forEach(async i => {
        if (testImage(i.url)) a.push(i.url)
        if (i.image) a.push(i.image.url)
        if (i.thumbnail) a.push(i.thumbnail.url)
      })
    }
    a = [...new Set(a)]
    
    if (a.length === 1) url = a[0];
    else if (a.length > 0) {
      const code = SnowflakeUtil.generate();
      const components = genButtons(a.length, this.boat, code);
      const filter = i => i.user.id === interaction.user.id && i.customId.split(':')[2] === code;

      await interaction.reply({ content: `There are ${a.length} images on that message which image would you like to get sauce for?`, components });
      const col = await interaction.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 5000 }).catch(err => err) as ButtonInteraction;
      if (!(col instanceof Error)) {
        url = a[col.customId.split(':')[1]];
        col.deferUpdate();
        message.channel.messages.cache.get(col.message.id)?.edit({ content: 'Loading Data', components: [] })
      } else return;
    }

    if (!url) return interaction.reply({ content: 'Please use this on a message with an image attachment!', ephemeral: true });

    const out: any = await sauce(url);

    if (!interaction.replied) await interaction.reply('Loading Data');
    
    const o = {
      boat: this.boat,
      interaction,
      data: out,
      length: out.length,
      callback: ({ data, offset }) => genEmbed(data, offset),
      options: { idle: 15000 },
      editreply: true
    }

    return InteractionPaginator(o)

  }
}

function genEmbed(data, offset) {
  const info = data[offset];

  const embed = new MessageEmbed();

  if (info.source) embed.addField('Title', info.source);
  embed
    .setTitle('Sauce found')
    .setImage(info.thumbnail)
    .addField('Similarity', info.similarity)
    .setFooter(`${offset + 1}/${data.length} ${info.year ? `• ${info.year}` : ''}`);

  if (info.est_time) embed.addField('Estimated Time', info.est_time);
  if (info.ext_urls) embed.addField('External URLS', info.ext_urls.join('\n'));

  return embed;
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


function testImage(url) {
  return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

export default SauceInteraction;
