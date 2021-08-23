import { MessageEmbed, MessageButton, Message, MessageActionRow, ButtonInteraction } from 'discord.js';
import nsauce from 'node-sauce';
import BaseCommand from '../../BaseCommand.js';
import isImageUrl from 'is-image-url';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
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
    
    let out: any = await sauce(url)

    const embed = await genEmbed(out, 0)

    return message.channel.send({ embeds: [embed] }).then(async msg => {
      let currentIndex = 0
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 

      if (currentIndex == 0) back.setDisabled(true) 
      if (currentIndex + 1 >= out.length) next.setDisabled(true) 

      let row = new MessageActionRow().addComponents(back, next)


      msg.edit({ embeds: [msg.embeds[0]], components: [row] });

      const filter = (interaction: ButtonInteraction) => interaction.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, idle: 15000 });

      collector.on('collect', async (interaction) => {
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 

        await interaction.deferUpdate();
        
        interaction.customId === 'collector:back' ? currentIndex -= 1 : currentIndex += 1
        if (currentIndex == 0) back.setDisabled(true) 
        if (currentIndex + 1 >= out.length) next.setDisabled(true) 

        let row = new MessageActionRow().addComponents(back, next);

        let e = await genEmbed(out, currentIndex)
        msg.edit({ embeds: [e], components: [row] })
      });
      collector.on('end', () => {
        console.log('t')
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next').setDisabled(true); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back').setDisabled(true);
        let row = new MessageActionRow().addComponents(back, next);

        msg.edit({ embeds: [msg.embeds[0]], components: [row] });
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



export default SauceCommand;
