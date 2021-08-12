'use strict';

import { MessageButton, MessageActionRow, ButtonInteraction, Message, MessageEmbed, SnowflakeUtil } from 'discord.js';
import nsauce from 'node-sauce';
let sauce = new nsauce(process.env.SAUCE_API_KEY);

import { ContextMenuInteraction } from 'discord.js';

import BaseInteraction from '../../../../BaseInteraction.js';

class ListInteraction extends BaseInteraction {
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
    if (message.attachments.size > 0) {
    message.attachments.forEach(i => {
    if (i.contentType.includes('image')) 
    });
    }
    else if (message.embeds.length > 0 && message.embeds[0].type == 'image') url = message.embeds[0].thumbnail.url
    if (!url) return interaction.reply({ content: 'Please use this on a message with an image attachment!', ephemeral: true })
    
    let out: any = await sauce(url)

    const embed = await genEmbed(out, 0)

    return interaction.reply({ embeds: [embed] }).then(async () => {
      let code = SnowflakeUtil.generate();
      let currentIndex = 0;
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`); 
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`); 

      if (currentIndex == 0) back.setDisabled(true) 
      if (currentIndex + 1 >= out.length) next.setDisabled(true) 

      let row = new MessageActionRow().addComponents(back, next)
<<<<<<< HEAD

=======
            
>>>>>>> eac493d7c79d5bc32010c65830bde6f693497c8b
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
      collector.on('end', () => {
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`).setDisabled(true); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`).setDisabled(true);
        let row = new MessageActionRow().addComponents(back, next);

        interaction.editReply({ components: [row] });
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

export default ListInteraction;
