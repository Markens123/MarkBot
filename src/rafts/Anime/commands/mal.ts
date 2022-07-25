import { EmbedBuilder, Message, ButtonInteraction, ColorResolvable } from 'discord.js';
import BaseCommand from '../../BaseCommand.js';
import { ClientI, CommandOptions, RaftI } from '../../../../lib/interfaces/Main.js';
import { Paginator } from '../../../util/Buttons.js';

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
    const client = this.boat.client;
    if (!client.maldata.has(message.author.id) || !client.maldata.has(message.author.id, 'AToken')) {
      return message.channel.send('Error: You did not link your MAL account yet!');
    }

    // Token refresh
    if (Date.now() >= client.maldata.get(message.author.id, 'EXPD')) {
      await refreshtoken(this.raft, message, client.maldata.get(message.author.id, 'RToken'), client);
    }

    if (args[0] === 'mylist' || args[0] === 'ml') {
      let sort = 'anime_title';
      let status = '';
      if (args.includes('--sort') || args.includes('-so')) {
        const index = args.indexOf('--sort') > -1 ? args.indexOf('--sort') : args.indexOf('-so');
        const filter = ['score', 'updated', 'title', 'date'];
        if (filter.includes(args[index + 1])) {
          if (args[index + 1] === 'score') sort = 'list_score';
          if (args[index + 1] === 'updated') sort = 'list_updated_at';
          if (args[index + 1] === 'title') sort = 'anime_title';
          if (args[index + 1] === 'date') sort = 'anime_start_date';
        } else return message.channel.send(`Error: valid sort options are \`${filter.join('` `')}\``);
        args.splice(index, 2);
      }

      if (args.includes('--status') || args.includes('-st')) {
        const index = args.indexOf('--status') > -1 ? args.indexOf('--status') : args.indexOf('-st');
        const filter = ['watching', 'completed', 'oh', 'onhold', 'dropped', 'ptw'];

        if (filter.includes(args[index + 1])) {
          if (args[index + 1] === 'watching') status = 'watching';
          if (args[index + 1] === 'completed') status = 'completed';
          if (args[index + 1] === 'dropped') status = 'dropped';
          if (args[index + 1] === 'oh') status = 'on_hold';
          if (args[index + 1] === 'onhold') status = 'on_hold';
          if (args[index + 1] === 'ptw') status = 'plan_to_watch';
        } else return message.channel.send(`Error: valid sort options are \`${filter.join('` `')}\``);
        args.splice(index, 2);
      }

      let offset = parseInt(args[1]) ? parseInt(args[1]) - 1 : 0;
      offset = offset < 0 ? 0 : offset;

      const rmsg = await message.channel.send('Loading data...');

      //@ts-expect-error
      let data = await this.raft.apis.list.getList(client.maldata.get(message.author.id, 'AToken'), sort, status, message.channel.nsfw)
      if (offset + 1 > data.data.length) return error(message, rmsg, `Error: You only have **${data.data.length}** items in your list`);


      rmsg.delete().catch(() => {});
      const filter = (interaction: ButtonInteraction) => interaction.user.id === message.author.id;
      
      const o = {
        boat: this.boat,
        message,
        data,
        offset,
        length: data.data.length,
        callback: ({ data, offset, message }) => genEmbed(data, message, offset),
        options: { filter, idle: 15000 }
      }

      return Paginator(o)
    }
    if (args[0] === 'search' || args[0] === 's') {
      const offset = 0;
      args.splice(0, 1);
      const q = args.join(' ');
      if (!q) return message.channel.send('You must enter a title to search for!');
      const rmsg = await message.channel.send('Loading data...');

      // @ts-ignore
      let data = await this.raft.apis.list.search(client.maldata.get(message.author.id, 'AToken'), q, message.channel.nsfw);
      if (data.data.length === 0) return error(message, rmsg, 'No results found');

      rmsg.delete().catch(() => {});
      const filter = interaction => interaction.user.id === message.author.id;

      const o = {
        boat: this.boat,
        message,
        data,
        offset,
        length: data.data.length,
        callback: ({ data, offset, message }) => genEmbed(data, message, offset),
        options: { filter, idle: 15000 }
      }

      return Paginator(o)
    }

    if (args[0] === 'get' || args[0] === 'g') {
      const offset = 0;
      if (!args[1]) return message.channel.send('You must provide an anime id!');
      if (!parseInt(args[1])) return message.channel.send('You must provide an anime id!');
      const rmsg = await message.channel.send('Loading data...');

      // @ts-ignore
      let data = await this.raft.apis.list.getAnime(client.maldata.get(message.author.id, 'AToken'), args[1]);
      if (data.response && data.response.statusText === 'Not Found') return error(message, rmsg, 'No results found');
      data = { data: [{ node: data }] };


      rmsg.delete().catch(() => {});
      const filter = interaction => interaction.user.id === message.author.id;

      const o = {
        boat: this.boat,
        message,
        data,
        offset,
        length: data.data.length,
        callback: ({ data, offset, message }) => genEmbed(data, message, offset),
        options: { filter, idle: 15000 }
      }

      return Paginator(o)

    }
    const cmd = this.boat.prefix + this.name;
    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('Usage')
      .addFields([
        {name: 'Commands',  value: `${cmd} ml/mylist (page #) (flags)\n${cmd} get/g <anime id>\n${cmd} search/s <title>\n`},
        {name: 'Flags', value: '--sort/-so <sort type>\n--status/-st <status>\n*Only usable with mylist*'}
      ]);

    message.channel.send({ embeds: [embed] });
  }
}

function gencolor(status: string): ColorResolvable  {
  if (status === 'watching') return '#32CD32';
  if (status === 'completed') return '#000080';
  if (status === 'on_hold') return '#E7B715';
  if (status === 'dropped') return '#A12F31';
  if (status === 'plan_to_watch') return '#8F8F8F';
  return '#000001';
}

function hreadable(text) {
  const str = text.split('_').join(' ');
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function error(message, rmsg, emsgtext) {
  if (rmsg.deletable) rmsg.delete();
  message.channel.send(emsgtext);
}

function genscore(score) {
  if (score == 0) return 'None given';
  if (score == 1) return '1 (Appalling)';
  if (score == 2) return '2 (Horrible)';
  if (score == 3) return '3 (Very Bad)';
  if (score == 4) return '4 (Bad)';
  if (score == 5) return '5 (Average)';
  if (score == 6) return '6 (Fine)';
  if (score == 7) return '7 (Good)';
  if (score == 8) return '8 (Very Good)';
  if (score == 9) return '9 (Great)';
  if (score == 10) return '10 (Masterpiece)';
}

function genEmbed(data, message, offset) {
  const anime = data.data[offset].node;

  const synopsis = anime.synopsis.length >= 1021 ? `${anime.synopsis.substring(0, 1021)}...` : anime.synopsis;
  if (!anime.my_list_status) {
    anime.my_list_status = {};
    anime.my_list_status.status = 'not_watched';
    anime.my_list_status.score = 0;
    anime.my_list_status.num_episodes_watched = 0;
  }

  return new EmbedBuilder()
    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
    .setColor(gencolor(anime.my_list_status.status))
    .setTitle(anime.title)
    .setURL(`https://myanimelist.net/anime/${anime.id}`)
    .setThumbnail(anime.main_picture.medium)
    .setFooter({text: `${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${anime.genres.map(a => a.name).join(', ')}`})
    .addFields([
      {name: 'Status', value: hreadable(anime.my_list_status.status)},
      {name: 'Score given', value: genscore(anime.my_list_status.score)},
      {
        name: 'Info',
        value: `**Score** ${anime.mean}\n**Ranked** ${anime.rank ? `#${anime.rank}` : 'N/A'}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(
          anime.num_list_users,
        ).toLocaleString('en-US')}\n **Episodes watched** ${anime.my_list_status.num_episodes_watched}/${anime.num_episodes}`,
      },
      {name: 'Synopsis', value: synopsis}
      ]);
}

async function refreshtoken(raft: RaftI, message: Message, rtoken: string, client: ClientI): Promise<Message | null> {
  const out = await raft.apis.oauth.refreshToken(rtoken).catch(() => undefined);

  if (!out?.access_token) return message.channel.send("An error has occured please relink your account, if there's still an issue please contact the bot dev!");

  await client.maldata.set(message.author.id, out.access_token, 'AToken');
  await client.maldata.set(message.author.id, out.refresh_token, 'RToken');
  await client.maldata.set(message.author.id, Date.now() + out.expires_in * 1000, 'EXPD');
}

export default MALCommand;
