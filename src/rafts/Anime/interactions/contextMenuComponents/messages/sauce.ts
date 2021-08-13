import { MessageButton, MessageActionRow, ButtonInteraction, Message, MessageEmbed, SnowflakeUtil, Snowflake, ContextMenuInteraction } from 'discord.js';
import nsauce from 'node-sauce';
const sauce = new nsauce(process.env.SAUCE_API_KEY);
import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';

class SauceInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'Sauce',
      enabled: true,
      type: 'MESSAGE',
    };
    super(raft, info);
  }

  async run(interaction: ContextMenuInteraction): Promise<any> {
    const message = interaction.options.getMessage('message') as Message;
    let url = '';
    const a = [];

    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType?.includes('image')) a.push(i.url);
      });

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
    } else if (message.embeds.length > 0 && message.embeds[0].type === 'image') url = message.embeds[0].thumbnail.url;
    if (!url) return interaction.reply({ content: 'Please use this on a message with an image attachment!', ephemeral: true });

    const out: any = await sauce(url);

    const embed = await genEmbed(out, 0);

    if (!interaction.replied) await interaction.reply('Loading Data');

    return interaction.editReply({ content: null, embeds: [embed] }).then(async () => {
      const code = SnowflakeUtil.generate();
      let currentIndex = 0;
      const message_id = (await interaction.fetchReply()).id;
      const next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`);
      const back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`);

      if (currentIndex === 0) back.setDisabled(true);
      if (currentIndex + 1 >= out.length) next.setDisabled(true);

      const row = new MessageActionRow().addComponents(back, next);
      interaction.editReply({ components: [row] });

      const filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code;
      const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 15000 });

      collector.on('collect', async int => {
        const next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`);
        const back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`);

        await int.deferUpdate();
        int.customId === `collector:back:${code}` ? (currentIndex -= 1) : (currentIndex += 1);
        if (currentIndex === 0) back.setDisabled(true);
        if (currentIndex + 1 >= out.length) next.setDisabled(true);

        const row = new MessageActionRow().addComponents(back, next);

        const e = genEmbed(out, currentIndex);
        interaction.editReply({ embeds: [e], components: [row] });
      });

      collector.on('end', () => {
        const next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`).setDisabled(true);
        const back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`).setDisabled(true);
        const row = new MessageActionRow().addComponents(back, next);

        interaction.channel.messages.cache.get(message_id)?.edit({ components: [row] });
      });
    });
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
  return a.chunk(5);
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    const array = this;
    return [].concat(...array.map((elem, i) => (i % chunkSize ? [] : new MessageActionRow().addComponents(array.slice(i, i + chunkSize)))));
  },
});

export default SauceInteraction;
