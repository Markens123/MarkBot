'use strict';

import { MessageButton, MessageActionRow, ButtonInteraction, Message, MessageEmbed, SnowflakeUtil, Snowflake } from 'discord.js';
import nsauce from 'node-sauce';
let sauce = new nsauce(process.env.SAUCE_API_KEY);

import { ContextMenuInteraction } from 'discord.js';

import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';

class SauceInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'Sauce',
      enabled: true,
      type: 'MESSAGE',
    };
    super(boat, info);
  }

  async run(interaction: ContextMenuInteraction) {
    let message = interaction.options.getMessage('message') as Message;
    let url = '';
    let a = [];

    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType.includes('image')) a.push(i.url);
      });

      if (a.length === 1) url = a[0];
      else if (a.length > 0) {
        let code = SnowflakeUtil.generate();
        let components = genButtons(a.length, this.boat, code);
        let filter = i => i.user.id === interaction.user.id && i.customId.split(':')[2] === code;

        await interaction.reply({ content: `There are ${a.length} images on that message which image would you like to get sauce for?`, components })
        let col = await interaction.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 5000 }).catch(err => {return err});
        if (!(col instanceof Error)) {
          url = a[col.customId.split(':')[1]];
          col.deferUpdate();
        }
        else return;

      }
    }

    else if (message.embeds.length > 0 && message.embeds[0].type == 'image') url = message.embeds[0].thumbnail.url
    if (!url) return interaction.reply({ content: 'Please use this on a message with an image attachment!', ephemeral: true })
    
    let out: any = await sauce(url);
    
    const embed = await genEmbed(out, 0);

    if (!interaction.replied) await interaction.reply('Loading Data');
    
    return interaction.editReply({ content: null, embeds: [embed] }).then(async () => {
      let code = SnowflakeUtil.generate();
      let currentIndex = 0;
      let message_id = (await interaction.fetchReply()).id;
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`); 
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`); 

      if (currentIndex == 0) back.setDisabled(true) 
      if (currentIndex + 1 >= out.length) next.setDisabled(true) 

      let row = new MessageActionRow().addComponents(back, next)
      interaction.editReply({ components: [row] });

      const filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code;
      const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 15000 });

      collector.on('collect', async (int) => {
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`); 

        await int.deferUpdate();
        int.customId === `collector:back:${code}` ? currentIndex -= 1 : currentIndex += 1;
        if (currentIndex === 0) back.setDisabled(true);
        if (currentIndex + 1 >= out.length) next.setDisabled(true);

        let row = new MessageActionRow().addComponents(back, next);

        let e = await genEmbed(out, currentIndex)
        interaction.editReply({ embeds: [e], components: [row] })
      });
      collector.on('end', async () => {
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`).setDisabled(true); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`).setDisabled(true);
        let row = new MessageActionRow().addComponents(back, next);
        
        interaction.channel.messages.cache.get(message_id)?.edit({ components: [row] });
      });

    });

  }
}

async function genEmbed(data, offset) {
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

function genButtons(num: number, boat: BoatI, code: Snowflake) {
  if (num > 10) {
    boat.log.warn('Sauce interaction/Gen Buttons function', 'The provided number was over 10');
    num = 10
  }

  let a = [];

  for (let i = 0; i < num; i++) {
    a.push({
      type: 'BUTTON',
      label: i+1,
      customId: `collector:${i}:${code}`,
      style: 'PRIMARY',
      emoji: null,
      url: null,
      disabled: false,
    })
  }
  //@ts-expect-error
  return a.chunk(5)
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    var array = this;
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : new MessageActionRow().addComponents(array.slice(i, i + chunkSize));
      })
    );
  }
});

export default SauceInteraction;
