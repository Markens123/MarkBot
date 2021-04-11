'use strict';
/* We did this without ck's help */

const Discord = require('discord.js');
const axios = require('axios');
const BaseCommand = require('../../BaseCommand');
const util = require('util');
const apitest = require('../api/index');

class MALCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'mal',
      owner: false,
      dms: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let client = this.boat.client;
    if (args.length === 0) return message.channel.send(`Usage: !mal show`);
    const offset = parseInt(args[1]) ? parseInt(args[1]) - 1 : 0
    if (args[0] == 'show') {
      const url = `https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1&sort=anime_title&offset=${offset}`
      const url2 = `https://api.myanimelist.net/v2/users/@me?fields=anime_statistics`

      if (!client.maldata.has(`${message.author.id}AToken`)) return message.channel.send('Error: You did not link your MAL account yet!')

      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(`${message.author.id}AToken`)}`
        }
      }
      const idreq = await axios.get(url, config);
      const url3 = `https://api.myanimelist.net/v2/anime/${idreq.data.data[0].node.id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`
      const animereq = await axios.get(url3, config);
      const userreq = await axios.get(url2, config);
      const anime = animereq.data
      const user = userreq.data
      console.log(util.inspect(anime))
      console.log(util.inspect(user))

      let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(gencolor(anime.my_list_status.status))
      .setTitle(anime.title)
      .setImage(anime.main_picture.medium)
      .setFooter(`${offset + 1}/${user.anime_statistics.num_items}`)

      message.channel.send(embed)

    }
  }
}

function gencolor(status) {
  if (status === 'watching') return '32CD32'
  else if (status === 'completed') return '000080'
  else if (status === 'on_hold') return 'E7B715'
  else if (status === 'dropped') return 'A12F31'
  else if (status === 'plan_to_watch') return '8F8F8F'
  else return '000001'
} 

module.exports = MALCommand;
