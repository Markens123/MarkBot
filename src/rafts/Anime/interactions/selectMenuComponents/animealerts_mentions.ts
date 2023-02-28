import { ActionRowBuilder, MentionableSelectMenuBuilder, MentionableSelectMenuInteraction } from 'discord.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class AnimeAlertsMentionsInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ANIMEALERTS_MENTIONS',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: MentionableSelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const roles = interaction.roles.map(x => x.toString());
    const users = interaction.users.map(x => x.toString()) as string[];
    const name = interaction.customId.split(':')[1];
    const id = interaction.customId.split(':')[2];
    
    client.animealerts.set(
      interaction.guild.id,
      users.concat(roles),
      `mentions.${id}`
    )

    interaction.reply({ content: `These are the new mentions for \`${name}\`: \n${roles.join(' ')} ${users.join(' ')}`, ephemeral: true }); 
  }

  generateDefinition(name: string, id: number | string): ActionRowBuilder<MentionableSelectMenuBuilder> {
    const customId = `${ComponentFunctions[this.name]}:${name}:${id}`;

    return new ActionRowBuilder({
      components: [
        new MentionableSelectMenuBuilder()
          .setCustomId(customId)
          .setPlaceholder('Nothing selected')
          .setMinValues(1)
          .setMaxValues(5),
      ],
    });
  }
}

export default AnimeAlertsMentionsInteraction;