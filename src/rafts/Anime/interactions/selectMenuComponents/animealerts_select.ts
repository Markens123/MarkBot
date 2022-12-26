import { ActionRowBuilder, MentionableSelectMenuBuilder, MentionableSelectMenuInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';
import { AnimeI } from '../../../../../lib/interfaces/Main.js';
import { InteractionYesNo } from '../../../../util/Buttons.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';
import AnimeAPI from '../../apis/anime.js';

class AnimeAlertsSelectInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ANIMEALERTS_SELECT',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: StringSelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const api = new AnimeAPI();
    const id = interaction.values[0];
    const name = interaction.customId.split(':')[1];
    await interaction.deferUpdate();
    const raw = await api.getAnime(id);

    const embeds = [api.genDemoEmbed(api.toSimple(raw, null))];

    const resp = await InteractionYesNo({
      interaction,
      options: {
        content: 'Is this the anime that you were looking for?',
        embeds
      },
      editReply: true
    });

    await interaction.editReply({ components: [], embeds: [] });

    if (client.animealerts.get(interaction.guild.id).animes.includes(raw.id.toString())) return interaction.editReply({ content: `\`${raw.title}\` is already setup for this server.` });
    if (raw.media_type === 'movie') return interaction.editReply({ content: `\`${raw.title}\` is a movie!` });
    if (raw.status === 'finished_airing') return interaction.editReply({ content: `\`${raw.title}\` has finished airing!` });

    if (!resp) return interaction.editReply({ content: 'Operation canceled. Please use a more precise title' });

    client.animealerts.push(interaction.guild.id, raw.id.toString(), 'animes');
    const row = boat.interactions.selectMenuComponents.get('ANIMEALERTS_MENTIONS').definition(name.replaceAll(':', ''), raw.id);
    interaction.editReply({ content: 'Anime has been added! Please use the select menu below to choose any roles or people to mention when a new episode comes out', components: [row]});
  }

  generateDefinition(name: string, anime: AnimeI[]): ActionRowBuilder<StringSelectMenuBuilder> {
    const customId = `${ComponentFunctions[this.name]}:${name}`;
    const options = anime.map(x => {
      return {
        label: x.title,
        value: x.id.toString()
      }
    })

    return new ActionRowBuilder({
      components: [
        new StringSelectMenuBuilder()
          .setCustomId(customId)
          .setPlaceholder('Nothing selected')
          .setOptions(options),
      ],
    });
  }
}

export default AnimeAlertsSelectInteraction;