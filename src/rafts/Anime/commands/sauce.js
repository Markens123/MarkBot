'use strict';

const { MessageEmbed, MessageButton } = require('discord.js');
let nsauce = require('node-sauce')
let sauce = new nsauce(process.env.SAUCE_API_KEY)
const BaseCommand = require('../../BaseCommand');
const isImageUrl = require('is-image-url');

class SauceCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'sauce',
      owner: false,
      dms: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let url = '';    
    if (message.attachments.size > 0) url = message.attachments.array()[0].url
    else if (message.embeds > 0 && message.embeds[0].type == 'image') url = reaction.message.embeds[0].thumbnail.url
    else if (args && isImageUrl(args[0])) url = args[0]
    if (!url) return message.channel.send('Please provide a valid image url or image attachment!')
    
    let out = await sauce(url)

    const embed = await genEmbed(out, 0)

    return message.channel.send({ embeds: [embed] }).then(async msg => {
      let currentIndex = 0
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomID('collector:next'); 
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomID('collector:back'); 

      if (currentIndex == 0) back.setDisabled(true) 
      if (currentIndex + 1 >= out.length) next.setDisabled(true) 

      msg.edit({ embeds: [msg.embeds[0]], components: [[back, next]] });

      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = msg.createMessageComponentInteractionCollector({ filter, idle: 15000 });

      collector.on('collect', async interaction => {
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomID('collector:next'); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomID('collector:back'); 
          
        await interaction.deferUpdate();
        
        interaction.customID === 'collector:back' ? currentIndex -= 1 : currentIndex += 1
        if (currentIndex == 0) back.setDisabled() 
        if (currentIndex + 1 >= out.length) next.setDisabled() 
        let e = await genEmbed(out, currentIndex)
        msg.edit({ embeds: [e], components: [[back, next]] })
      });
      collector.on('end', () => {
        console.log('t')
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomID('collector:next').setDisabled(true); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomID('collector:back').setDisabled(true); 
        msg.edit({ embeds: [msg.embeds[0]], components: [[back, next]] });
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



module.exports = SauceCommand;
