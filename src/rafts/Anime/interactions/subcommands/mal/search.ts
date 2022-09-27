import { ButtonInteraction, ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { InteractionPaginatorOptions } from '../../../../../../lib/interfaces/Main.js';
import { InteractionPaginator } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { genEmbedI } from '../../../util/index.js';

class SearchInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'search',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.type !== ChannelType.GuildText) return;
    const boat = this.boat;
    const client = boat.client;
    const query = interaction.options.getString('query');
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

    let data = await this.raft.apis.list.search({ token, query, client: use_client, nsfw: interaction.channel.nsfw });

    const filter = (interaction: ButtonInteraction) => interaction.user.id === interaction.user.id;

    const o: InteractionPaginatorOptions = {
      boat: this.boat,
      interaction,
      data,
      offset,
      length: data.data.length,
      callback: ({ data, offset, interaction }) => genEmbedI(data, interaction, offset, use_client),
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


export default SearchInteraction;
