import { ButtonInteraction, ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { InteractionPaginatorOptions } from '../../../../../../lib/interfaces/Main.js';
import { InteractionPaginator } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { genEmbed } from '../../../util/index.js';

class MALGetInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'get',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.type !== ChannelType.GuildText) return;
    const boat = this.boat;
    const client = boat.client;
    const id = interaction.options.getInteger('id');
    let use_client = true;
    let token = false;
    let offset = 0;

    await interaction.deferReply()

    if (client.maldata.has(interaction.user.id) && client.maldata.has(interaction.user.id, 'AToken')) {
      use_client = false
      token = client.maldata.get(interaction.user.id, 'AToken')

      // Token refresh
      if (Date.now() >= client.maldata.get(interaction.user.id, 'EXPD')) {
        await this.refreshtoken(interaction, client.maldata.get(interaction.user.id, 'RToken'));
      }
    }

    let data = await this.raft.apis.list.getAnime({ token, id, client: use_client });
    if (data.response && data.response.statusText === 'Not Found') return interaction.editReply('No results found');
    data = { data: [{ node: data }] };

    const filter = (interaction: ButtonInteraction) => interaction.user.id === interaction.user.id;

    const o: InteractionPaginatorOptions = {
      boat: this.boat,
      interaction,
      data,
      offset,
      length: data.data.length,
      callback: ({ data, offset, interaction }) => genEmbed(data, interaction.user, offset, use_client),
      options: { filter, idle: 15000 },
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


export default MALGetInteraction;
