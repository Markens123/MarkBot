'use strict';

const axios = require('axios');

const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');

class SpaceCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'space',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message) {
    async function explore() {
      let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
      const stars = await axios.get(url);
      console.log(stars);
      return stars;
    }
    const stars = await explore();
    // Message.channel.send(`${stars.data.url}`)
    let embed = new Discord.MessageEmbed()
      .setTitle(`${stars.data.title}`)
      .setURL('https://apod.nasa.gov/')
      .setColor('#00FF00')
      .setDescription(`${stars.data.explanation}`)
      .setImage(`${stars.data.url}`)
      .addField('Date', `${stars.data.date}`)
      .setTimestamp()
      .setFooter('nasa.gov', 'https://cdn.discordapp.com/app-assets/811111315988283413/811114038036529152.png');
    message.channel.send(embed);
  }
}

module.exports = SpaceCommand;
