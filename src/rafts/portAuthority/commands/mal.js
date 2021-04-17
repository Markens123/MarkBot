'use strict';
/* We did this without ck's help */

const Discord = require('discord.js');
const axios = require('axios');
const BaseCommand = require('../../BaseCommand');

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
    if (!client.maldata.has(`${message.author.id}AToken`)) return message.channel.send('Error: You did not link your MAL account yet!')
    let offset = parseInt(args[1]) ? parseInt(args[1]) - 1 : 0
    offset = offset < 0 ? 0 : offset 

    if (args[0] == 'show') {
      if (args.length === 0) return message.channel.send(`Usage: !mal show (#)`);
      const rmsg = await message.channel.send('Loading data...')

      // Token refresh
      if (Date.now() >= client.maldata.get(`${message.author.id}EXPD`)) await refreshtoken(client.maldata.get(`${message.author.id}RToken`), client) 

      // Var setup
      const url = 'https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics&limit=100&sort=anime_title'
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(`${message.author.id}AToken`)}`
        }
      }      
      // Data search
      let data = await axios.get(url, config);
      data = data.data
      if (!(data.paging && Object.keys(data.paging).length === 0 && data.paging.constructor === Object)) {
        if (data.paging.next) {
          let w = false;
          while (w == false) {
            let req = await axios.get(data.paging.next, config);
            req = req.data
            data.data = data.data.concat(req.data)

            if (req.paging.next) w = false 
            else w = true
          }
        }
      }
      if (offset + 1 > data.data.length) return error(message, rmsg, `Error: You only have **${data.data.length}** items in your list`)

      let embed = await genEmbed(data, message, offset);

      if (rmsg.deletable) rmsg.delete();
      message.channel.send(embed).then(async msg => {
        let currentIndex = offset

        if (currentIndex !== 0) await msg.react('⬅️')
        if (currentIndex + 1 < data.data.length) await msg.react('➡️')

        const collector = msg.createReactionCollector(
          // only collect left and right arrow reactions from the message author
          (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id,
          // time out after a minute
          {time: 60000}
        )        
        collector.on('collect', reaction => {
          msg.reactions.removeAll().then(async () => {
            reaction.emoji.name === '⬅️' ? currentIndex -= 1 : currentIndex += 1
            msg.edit(await genEmbed(data, message, currentIndex))
            if (currentIndex !== 0) await msg.react('⬅️')
            if (currentIndex + 1 < data.data.length) msg.react('➡️')
          });
        });
      });


    } 
  }
}

function gencolor(status) {
  if (status === 'watching') return '32CD32'
  if (status === 'completed') return '000080'
  if (status === 'on_hold') return 'E7B715'
  if (status === 'dropped') return 'A12F31'
  if (status === 'plan_to_watch') return '8F8F8F'
  return '000001'
}

function hreadable(text) {
  let str = text.split('_').join(' ')
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
});
}

function error(message, rmsg, emsgtext) {
  if (rmsg.deletable) rmsg.delete();
  message.channel.send(emsgtext)
}

function genscore(score) {
  if (score == 0) return 'None given'
  if (score == 1) return '1 (Appalling)'
  if (score == 2) return '2 (Horrible)'
  if (score == 3) return '3 (Very Bad)'
  if (score == 4) return '4 (Bad)'
  if (score == 5) return '5 (Average)'
  if (score == 6) return '6 (Fine)'
  if (score == 7) return '7 (Good)'
  if (score == 8) return '8 (Very Good)'
  if (score == 9) return '9 (Great)'
  if (score == 10) return '10 (Masterpiece)'
}


async function genEmbed(data, message, offset) {

  const anime = data.data[offset].node

  let synopsis = anime.synopsis.length >= 1021 ? `${anime.synopsis.substring(0, 1021)}...` : anime.synopsis

  return new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setColor(gencolor(anime.my_list_status.status))
  .setTitle(anime.title)
  .setURL(`https://myanimelist.net/anime/${anime.id}`)
  .setThumbnail(anime.main_picture.medium)
  .setFooter(`${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${(anime.genres.map(a => a.name)).join(', ')}`)
  .addField('Status', hreadable(anime.my_list_status.status))
  .addField('Score given', genscore(anime.my_list_status.score))
  .addField('Info', `**Score** ${anime.mean}\n**Ranked** #${anime.rank}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(anime.num_list_users).toLocaleString('en-US')}`)
  .addField('Synopsis', synopsis);
}

async function refreshtoken(rtoken, client) {
  const url = `https://myanimelist.net/v1/oauth2/token`
  const params = new URLSearchParams()
  params.append('client_id', process.env.MAL_CLIENT_ID);
  params.append('client_secret', process.env.MAL_CLIENT_SECRET);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', rtoken);
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const out = await axios.post(url, params, config)
  await client.maldata.set(`${message.author.id}AToken`, out.data.access_token);
  await client.maldata.set(`${message.author.id}RToken`, out.data.refresh_token);
  await client.maldata.set(`${message.author.id}EXPD`, Date.now() + (out.data.expires_in * 1000));

}

module.exports = MALCommand;
