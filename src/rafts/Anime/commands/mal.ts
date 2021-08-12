'use strict';

import { MessageEmbed, MessageButton, Message, MessageActionRow, ButtonInteraction } from 'discord.js';
import axios from 'axios';
import BaseCommand from '../../BaseCommand.js';
import { ClientI, CommandOptions, RaftI } from '../../../../lib/interfaces/Main.js';

class MALCommand extends BaseCommand { 
  constructor(boat) {
    const options: CommandOptions = {
      name: 'mal',
      owner: false,
      dms: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    let client = this.boat.client;
    if (!client.maldata.has(message.author.id) || !client.maldata.has(message.author.id, 'AToken')) return message.channel.send('Error: You did not link your MAL account yet!')

    // Token refresh 
    if (Date.now() >= client.maldata.get(message.author.id, 'EXPD')) await refreshtoken(this.raft, message, client.maldata.get(message.author.id, 'RToken'), client) 


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
      //@ts-ignore
      const url = `https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes&limit=10&sort=${sort}${status ? `&status=${status}` : ''}${message.channel.nsfw ? '&nsfw=true' : '&nsfw=false'}`
      
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(message.author.id, 'AToken')}`
        }
      }

      // Data search
      let data = await axios.get(url, config) as any;
      data = data.data;
      if (!(data.paging && Object.keys(data.paging).length === 0 && data.paging.constructor === Object)) {
        if (data.paging.next) {
          let w = false;
          while (w == false) {
            let req = await axios.get(data.paging.next, config) as any;
            req = req.data
            data.data = data.data.concat(req.data)
            data.paging.next = req.paging.next
            if (req.paging.next) w = false 
            else w = true
          }
        }
      }
      if (offset + 1 > data.data.length) return error(message, rmsg, `Error: You only have **${data.data.length}** items in your list`)

      let embed = await genEmbed(data, message, offset);

      if (rmsg.deletable) rmsg.delete();
      return message.channel.send({ embeds: [embed] }).then(async msg => {
        let currentIndex = offset
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 
        let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete');

        if (currentIndex == 0) back.setDisabled(true);
        if (currentIndex + 1 >= data.data.length) next.setDisabled(true); 

        let row = new MessageActionRow().addComponents(back, next, del);

        msg.edit({ embeds: [msg.embeds[0]], components: [row] })

        const filter = (interaction: ButtonInteraction) => interaction.user.id === message.author.id;        
        const collector = msg.createMessageComponentCollector({ filter, idle: 15000 });
        
        let deleted = false;        
        collector.on('collect', async (interaction) => {
          let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
          let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 
          let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete');

          interaction.deferUpdate();

          if (interaction.customId === 'collector:delete') {
            await msg.delete()
            deleted = true
            collector.stop()
            return;
          }
          
          interaction.customId === 'collector:back' ? currentIndex -= 1 : currentIndex += 1;

          if (currentIndex == 0) back.setDisabled(true);
          if (currentIndex + 1 >= data.data.length) next.setDisabled(true);

          let row = new MessageActionRow().addComponents(back, next, del);
          let e = await genEmbed(data, message, currentIndex)
          msg.edit({ embeds: [e], components: [row] })
        });
        collector.on('end', () => {
          let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next').setDisabled(true); 
          let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back').setDisabled(true); 
          let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete').setDisabled(true);
          let row = new MessageActionRow().addComponents(back, next, del);

          if (!deleted) msg.edit({ embeds: [msg.embeds[0]], components: [row] });
        });
      });

    }
    if (args[0] == 'search' || args[0] == 's') {
      let offset = 0; 
      args.splice(0, 1);
      const q = args.join(' ')
      if (!q) return message.channel.send('You must enter a title to search for!')
      const rmsg = await message.channel.send('Loading data...');
      // Var setup
      //@ts-ignore
      const url = `https://api.myanimelist.net/v2/anime?q=${encodeURI(q)}&limit=100&fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes${message.channel.nsfw ? '&nsfw=true' : '&nsfw=false'}` 
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(message.author.id, 'AToken')}`
        }
      }

      // Data search
      let data = await axios.get(url, config) as any;
      data = data.data
      if (!(data.paging && Object.keys(data.paging).length === 0 && data.paging.constructor === Object)) {
        if (data.paging.next) {
          let w = false;
          let i = 0;
          while (w == false) {
            let req = await axios.get(data.paging.next, config) as any;
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
      return message.channel.send({ embeds: [embed] }).then(async msg => {
        let currentIndex = offset
        let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
        let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 
        let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete');

        if (currentIndex == 0) back.setDisabled(true);
        if (currentIndex + 1 >= data.data.length) next.setDisabled(true);
        
        let row = new MessageActionRow().addComponents(back, next, del);

        msg.edit({ embeds: [msg.embeds[0]], components: [row] })

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, idle: 15000 });

        let deleted = false;        
        collector.on('collect', async interaction => {
          let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next'); 
          let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back'); 
          let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete');
          let row = new MessageActionRow().addComponents(back, next, del);

          interaction.deferUpdate();

          if (interaction.customID === 'collector:delete') {
            await msg.delete()
            deleted = true
            collector.stop()
            return;
          }
          
          interaction.customID === 'collector:back' ? currentIndex -= 1 : currentIndex += 1
          if (currentIndex == 0) back.setDisabled(true) 
          if (currentIndex + 1 >= data.data.length) next.setDisabled(true) 
          let e = await genEmbed(data, message, currentIndex)
          msg.edit({ embeds: [e], components: [row] });
        });
        collector.on('end', () => {
          let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next').setDisabled(true);
          let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back').setDisabled(true);
          let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete').setDisabled(true);
          let row = new MessageActionRow().addComponents(back, next, del);

          if (!deleted) msg.edit({ embeds: [msg.embeds[0]], components: [row] });
        });
      });

    }
    if (args[0] == 'get' || args[0] == 'g') {
      let offset = 0; 
      if (!args[1]) return message.channel.send('You must provide an anime id!')
      if (!parseInt(args[1])) return message.channel.send('You must provide an anime id!')
      const rmsg = await message.channel.send('Loading data...');
      
      // Var setup
      //@ts-ignore
      const url = `https://api.myanimelist.net/v2/anime/${args[1]}?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes${message.channel.nsfw ? '&nsfw=true' : '&nsfw=false'}` 
      const config = {
        headers: {
          'Authorization': `Bearer ${client.maldata.get(message.author.id, 'AToken')}`
        }
      }

      // Data search
      let data = await axios.get(url, config).catch(err => { return err })

      if (data.response && data.response.statusText == 0) return error(message, rmsg, 'No results found');

      data = {'data': [{'node': data.data}]}


      let embed = await genEmbed(data, message, offset);

      if (rmsg.deletable) rmsg.delete();
      return message.channel.send({ embeds: [embed] }).then(async msg => {
        let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete')
        let row = new MessageActionRow().addComponents(del)
        msg.edit({ embeds: [msg.embeds[0]], components: [row] })

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, idle: 15000 });

        let deleted = false;        
        collector.on('collect', async interaction => {

          interaction.deferUpdate();

          if (interaction.customID === 'collector:delete') {
            await msg.delete()
            deleted = true
            collector.stop()
            return;
          }
        });
        collector.on('end', () => {
          let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId('collector:delete').setDisabled(true);
          let row = new MessageActionRow().addComponents(del);

          if (!deleted) msg.edit({ embeds: [msg.embeds[0]], components: [row] });
        });
      });
    }
    const cmd = this.boat.prefix + this.name    
    const embed = new MessageEmbed()
    .setColor('DARK_RED')
    .setTitle('Usage')
    .addField('Commands', `${cmd} ml/mylist (page #) (flags)\n${cmd} get/g <anime id>\n${cmd} search/s <title>\n`)
    .addField('Flags', '--sort/-so <sort type>\n--status/-st <status>\n*Only usable with mylist*')
    
    message.channel.send({ embeds: [embed] })
  }

}

function gencolor(status) {
  if (status === 'watching') return '#32CD32'
  if (status === 'completed') return '#000080'
  if (status === 'on_hold') return '#E7B715'
  if (status === 'dropped') return '#A12F31'
  if (status === 'plan_to_watch') return '#8F8F8F'
  return '#000001'
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

  return new MessageEmbed()
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setColor(gencolor(anime.my_list_status.status))
  .setTitle(anime.title)
  .setURL(`https://myanimelist.net/anime/${anime.id}`)
  .setThumbnail(anime.main_picture.medium)
  .setFooter(`${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${(anime.genres.map(a => a.name)).join(', ')}`)
  .addField('Status', hreadable(anime.my_list_status.status))
  .addField('Score given', genscore(anime.my_list_status.score))
  .addField('Info', `**Score** ${anime.mean}\n**Ranked** ${anime.rank ? '#'+anime.rank: 'N/A'}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(anime.num_list_users).toLocaleString('en-US')}\n **Episodes watched** ${anime.my_list_status.num_episodes_watched}/${anime.num_episodes}`)
  .addField('Synopsis', synopsis);
}

async function refreshtoken(raft: RaftI, message: Message, rtoken: string, client: ClientI): Promise<Message | null> {
  const out = await raft.apis.oauth.refreshToken(rtoken).catch(err => {this.boat.log.verbose(module, `Error getting token ${err}`)});

  if (!out.access_token) return message.channel.send("An error has occured please relink your account, if there's still an issue please contact the bot dev!")

  await client.maldata.set(message.author.id, out.access_token, 'AToken');
  await client.maldata.set(message.author.id, out.refresh_token, 'RToken');
  await client.maldata.set(message.author.id, Date.now() + (out.expires_in * 1000), 'EXPD');

}

export default MALCommand;
