import { ChatInputCommandInteraction } from 'discord.js';
import { InteractionYesNo } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import AnimeAPI from '../../../apis/anime.js';

class AAlertsRemoveInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'remove',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const id = interaction.options.getInteger('id', true).toString();
    await interaction.deferReply({ ephemeral: true });

    const api = new AnimeAPI();
    const anime = await api.getAnime(id);

    if (!anime) return interaction.editReply({ content: 'That anime does not exist!' });

    if (!client.animealerts.get(interaction.guild.id, 'animes').includes(id)) return interaction.editReply({ content: "That anime isn't added to this server!" })

    if (!client.animealerts.has(interaction.guild.id)) return interaction.editReply({ content: 'Anime alerts have not been setup in this server!' });

    const resp = await InteractionYesNo({
      interaction,
      options: {
        content: `Are you sure that you want to remove \`${anime.title}\`?`,
      },
      editReply: true
    });

    if (!resp) return interaction.editReply({ content: 'Operation canceled.', components: [] });

    const newarr = client.animealerts.get(interaction.guild.id).animes.filter(x => x !== id);
    client.animealerts.set(interaction.guild.id, newarr, 'animes')
    client.animealerts.delete(interaction.guild.id, `mentions.${id}`);

    interaction.editReply({ content: 'Anime has been removed!', components: [] })
  }
}

export default AAlertsRemoveInteraction;
