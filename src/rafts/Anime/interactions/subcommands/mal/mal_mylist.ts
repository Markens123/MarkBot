import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { InteractionPaginatorOptions } from '../../../../../../lib/interfaces/Main.js';
import { InteractionPaginator } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { genEmbed } from '../../../util/index.js';

class MALMyListInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'mylist',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const sort = interaction.options.getString('sort', false) ?? 'anime_title';
    const status = interaction.options.getString('status', false) ?? '';
    let offset = interaction.options.getInteger('page', false) - 1 ?? 0;
    if (offset < 0) offset = 0;

    if (!client.maldata.has(interaction.user.id) || !client.maldata.has(interaction.user.id, 'AToken')) {
      return interaction.reply({ content: 'Error: You did not link your MAL account yet!', ephemeral: true });
    }

    await interaction.deferReply()

    // Token refresh
    if (Date.now() >= client.maldata.get(interaction.user.id, 'EXPD')) {
      await this.refreshtoken(interaction, client.maldata.get(interaction.user.id, 'RToken'));
    }

    //@ts-expect-error this is expected bc of nsfw
    let data = await this.raft.apis.list.getList(client.maldata.get(interaction.user.id, 'AToken'), sort, status, interaction.channel.nsfw)
    if (offset + 1 > data.data.length) offset = 0;

    const filter = (interaction: ButtonInteraction) => interaction.user.id === interaction.user.id;

    const o: InteractionPaginatorOptions = {
      boat: this.boat,
      interaction,
      data,
      offset,
      length: data.data.length,
      callback: ({ data, offset, interaction }) => genEmbed(data, interaction.user, offset),
      options: { filter, idle: 60000 },
      editreply: true
    }

    return InteractionPaginator(o)
  }

  async refreshtoken(interaction: ChatInputCommandInteraction, rtoken: string) {
    const client = this.boat.client;
    const raft = this.raft;

    const out = await raft.apis.oauth.refreshToken(rtoken).catch(() => undefined);

    if (!out?.access_token) {
      return interaction.reply({
        content: "An error has occured please relink your account, if there's still an issue please contact the bot dev!",
        ephemeral: true
      });
    }

    client.maldata.set(interaction.user.id, out.access_token, 'AToken');
    client.maldata.set(interaction.user.id, out.refresh_token, 'RToken');
    client.maldata.set(interaction.user.id, Date.now() + out.expires_in * 1000, 'EXPD');
  }
}


export default MALMyListInteraction;
