'use strict';

const Discord = require('discord.js');
let nsauce = require('node-sauce')
let sauce = new nsauce(process.env.SAUCE_API_KEY)
const BaseCommand = require('../../BaseCommand');
const isImageUrl = require('is-image-url');
const { MessageButton } = require('discord-buttons');

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
    if (message.embeds > 0 && message.embeds[0].type == 'image') url = reaction.message.embeds[0].thumbnail.url
    if (args && isImageUrl(args[0])) url = args[0]
    if (!url) return message.channel.send('Please provide a valid image url or image attachment!')
    
    let out = await sauce(url)

    const embed = await genEmbed(out, message, 0)

    return message.channel.send(embed).then(async msg => {
      let currentIndex = 0
      let next = new MessageButton().setLabel('➡️').setStyle('blurple').setID('next') 
      let back = new MessageButton().setLabel('⬅️').setStyle('blurple').setID('back') 

      if (currentIndex == 0) back.setDisabled() 
      if (currentIndex + 1 >= out.length) next.setDisabled() 

      msg.edit({buttons:[back, next]})

      const collector = msg.createButtonCollector(
        (button) => button.clicker.user.id === message.author.id,
        {time: 15000}
      )

      collector.on('collect', async b => {
        let next = new MessageButton().setLabel('➡️').setStyle('blurple').setID('next') 
        let back = new MessageButton().setLabel('⬅️').setStyle('blurple').setID('back')
        
        collector.resetTimer();

        b.defer();
        
        b.id === 'back' ? currentIndex -= 1 : currentIndex += 1
        if (currentIndex == 0) back.setDisabled() 
        if (currentIndex + 1 >= out.length) next.setDisabled() 
        let e = await genEmbed(out, message, currentIndex)
        msg.edit({embed: e, buttons: [back, next]})
      });
      collector.on('end', () => {
        let next = new MessageButton().setLabel('➡️').setStyle('blurple').setID('next').setDisabled()
        let back = new MessageButton().setLabel('⬅️').setStyle('blurple').setID('back').setDisabled()
        msg.edit({buttons: [back, next]});
      });

    });
    }
}

async function genEmbed(data, message, offset) {
  let info = data[offset]
  
  const embed = new Discord.MessageEmbed();

  if (info.source) embed.addField('Title', info.source);
  embed.setTitle('Sauce found')
  .setImage(info.thumbnail)
  .addField('Similarity', info.similarity)
  .setFooter(`${offset + 1}/${data.length} ${info.year ? `• ${info.year}` : ''}`)

  if (info.est_time) embed.addField('Estimated Time', info.est_time)
  if (info.ext_urls) embed.addField('External URLS', info.ext_urls.join('\n'))

  return embed
}



module.exports = SauceCommand;
