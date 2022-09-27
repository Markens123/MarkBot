import { ButtonInteraction, EmbedBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { Paginator } from '../../../util/Buttons.js';
import BaseCommand from '../../BaseCommand.js';
import { genEmbed } from '../util/index.js';

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
      await this.refreshtoken(message, client.maldata.get(message.author.id, 'RToken'));
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
      if (offset + 1 > data.data.length) return error(rmsg, `Error: You only have **${data.data.length}** items in your list`);

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

      // @ts-expect-error
      let data = await this.raft.apis.list.search(client.maldata.get(message.author.id, 'AToken'), q, message.channel.nsfw);
      if (data.data.length === 0) return error(rmsg, 'No results found');

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
      if (data.response && data.response.statusText === 'Not Found') return error(rmsg, 'No results found');
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

  async refreshtoken(message: Message, rtoken: string): Promise<Message | null> {
    const client = this.boat.client;
    const raft = this.raft;

    const out = await raft.apis.oauth.refreshToken(rtoken).catch(() => undefined);
  
    if (!out?.access_token) return message.channel.send("An error has occured please relink your account, if there's still an issue please contact the bot dev!");
  
    client.maldata.set(message.author.id, out.access_token, 'AToken');
    client.maldata.set(message.author.id, out.refresh_token, 'RToken');
    client.maldata.set(message.author.id, Date.now() + out.expires_in * 1000, 'EXPD');
  }  
}

function error(rmsg: Message, emsgtext: string) {
  if (rmsg.deletable) rmsg.delete().catch(() => {});
  rmsg.channel.send(emsgtext);
}

export default MALCommand;
