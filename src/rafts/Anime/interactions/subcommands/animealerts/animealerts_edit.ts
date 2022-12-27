import { ChatInputCommandInteraction } from 'discord.js';
import { InteractionYesNo } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import AnimeAPI from '../../../apis/anime.js';

class AAlertsEditInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'edit',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const id = interaction.options.getInteger('id', true).toString();
    const remove = interaction.options.getBoolean('remove', false);

    await interaction.deferReply({ ephemeral: true });

    const api = new AnimeAPI();
    const anime = await api.getAnime(id);

    if (!anime) return interaction.editReply({ content: 'That anime does not exist!' });

    if (remove) {
      const resp = await InteractionYesNo({
        interaction,
        options: {
          content: `Are you sure that you want to remove the mentions for \`${anime.title}\`?`,
        },
        editReply: true
      });

      if (!resp) return interaction.editReply({ content: 'Operation canceled.', components: [] });

      client.animealerts.delete(interaction.guild.id, `mentions.${id}`)

      return interaction.editReply({ content: `The mentions for \`${anime.title}\` have been removed!`, components: [] });
    }

    const row = boat.interactions.selectMenuComponents.get('ANIMEALERTS_MENTIONS').definition(anime.title.replaceAll(':', ''), id);


    interaction.editReply({ content: `Please use the select menu below to edit the mentions for \`${anime.title}\`!`, components: [row] });
  }
}

export default AAlertsEditInteraction;
