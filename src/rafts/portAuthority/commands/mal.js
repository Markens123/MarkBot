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
    if (!client.maldata.has(message.author.id) || !client.maldata.has(message.author.id, 'AToken')) return message.channel.send('Error: You did not link your MAL account yet!')

    // Token refresh 
    if (Date.now() >= client.maldata.get(message.author.id, 'EXPD')) await refreshtoken(client.maldata.get(message.author.id, 'RToken'), client) 


    if (args[0] == 'mylist' || args[0] == 'ml') {
      let sort = 'anime_title';
      let status = '';
      if (args.includes('--sort') || args.includes('-so')) {
        const index = args.indexOf('--sort') > -1 ? args.indexOf('--sort') : args.indexOf('-so');
        const filter = ['score', 'updated', 'title', 'date'] 
        if (filter.includes(args[index + 1])) {
          if (args[index + 1] == 'score') sort = 'list_score'
          if (args[index + 1] == 'updated') sort = 'list_updated_at'
          if (args[index + 1] == 'title') sort = 'anime_title'
          if (args[index + 1] == 'date') sort = 'anime_start_date'
        } else return message.channel.send(`Error: valid sort options are \`${filter.join('` `')}\``)
        args.splice(index, 2);
      }

      if (args.includes('--status') || args.includes('-st')) {
        const index = args.indexOf('--status') > -1 ? args.indexOf('--status') : args.indexOf('-st');
        const filter = ['watching', 'completed', 'oh', 'onhold', 'dropped', 'ptw'] 

        if (filter.includes(args[index + 1])) {
          if (args[index + 1] == 'watching') status = 'watching'
          if (args[index + 1] == 'completed') status = 'completed'
          if (args[index + 1] == 'dropped') status = 'dropped'
          if (args[index + 1] == 'oh') status = 'on_hold'
          if (args[index + 1] == 'onhold') status = 'on_hold'
          if (args[index + 1] == 'ptw') status = 'plan_to_watch'

        } else return message.channel.send(`Error: valid sort options are \`${filter.join('` `')}\``)
        args.splice(index, 2);
      }      

      let offset = parseInt(args[1]) ? parseInt(args[1]) - 1 : 0
      offset = offset < 0 ? 0 : offset 

      const rmsg = await message.channel.send('Loading data...')

      // Var setup
      const url = `https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes&limit=100&sort=${sort}${status ? `&status=${status}` : ''}`
      
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(message.author.id, 'AToken')}`
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
      return message.channel.send(embed).then(async msg => {
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
    if (args[0] == 'search' || args[0] == 's') {
      let offset = 0; 
      args.splice(0, 1);
      const q = args.join(' ')
      console.log(q)
      if (!q) return message.channel.send('You must enter a title to search for!')
      const rmsg = await message.channel.send('Loading data...');
      // Var setup
      const url = `https://api.myanimelist.net/v2/anime?q=${encodeURI(q)}&limit=100&fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes` 
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(message.author.id, 'AToken')}`
        }
      }

      // Data search
      let data = await axios.get(url, config);
      data = data.data
      if (!(data.paging && Object.keys(data.paging).length === 0 && data.paging.constructor === Object)) {
        if (data.paging.next) {
          let w = false;
          let i = 0;
          while (w == false) {
            let req = await axios.get(data.paging.next, config);
            req = req.data
            data.data = data.data.concat(req.data)

            if (req.paging.next) w = false 
            else w = true
            i++
            if (i >= 2) w = true
          }
        }
      }
      if (data.data.length == 0) return error(message, rmsg, 'No results found');

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

  let anime = data.data[offset].node
  let synopsis = anime.synopsis.length >= 1021 ? `${anime.synopsis.substring(0, 1021)}...` : anime.synopsis
  
  if (!anime.my_list_status) {
    anime.my_list_status = {}
    anime.my_list_status.status = 'not_watched'
    anime.my_list_status.score = 0
    anime.my_list_status.num_episodes_watched = 0
  }

  return new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setColor(gencolor(anime.my_list_status.status))
  .setTitle(anime.title)
  .setURL(`https://myanimelist.net/anime/${anime.id}`)
  .setThumbnail(anime.main_picture.medium)
  .setFooter(`${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${(anime.genres.map(a => a.name)).join(', ')}`)
  .addField('Status', hreadable(anime.my_list_status.status))
  .addField('Score given', genscore(anime.my_list_status.score))
  .addField('Info', `**Score** ${anime.mean}\n**Ranked** #${anime.rank}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(anime.num_list_users).toLocaleString('en-US')}\n **Episodes watched** ${anime.my_list_status.num_episodes_watched}/${anime.num_episodes}`)
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
  await client.maldata.set(message.author.id, out.data.access_token, 'AToken');
  await client.maldata.set(message.author.id, out.data.refresh_token, 'RToken');
  await client.maldata.set(message.author.id, Date.now() + (out.data.expires_in * 1000), 'EXPD');

}

module.exports = MALCommand;
