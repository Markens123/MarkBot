import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import AnimeAPI from '../../../apis/anime.js';

class AAlertsAddInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'add',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const name = interaction.options.getString('name', true);

    await interaction.deferReply({ ephemeral: true });

    if (!client.animealerts.has(interaction.guild.id)) return interaction.editReply({ content: 'Amime alerts have not been setup in this server!' });

    const api = new AnimeAPI();
    const search = await api.search(name);

    const row = boat.interactions.selectMenuComponents.get('ANIMEALERTS_SELECT').definition(name, search);

    return interaction.editReply({ content: 'Select the anime that you want to add', components: [row] })
  }
}

export default AAlertsAddInteraction;
