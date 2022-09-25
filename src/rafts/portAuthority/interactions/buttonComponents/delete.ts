import { ButtonBuilder, ButtonInteraction, ButtonStyle, Snowflake } from 'discord.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class DeleteInteraction extends BaseInteraction {
  
  definition: (user: Snowflake) => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'DELETE',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const author = interaction.customId.split(':').slice(1)[0];

    if (author == interaction.user.id) {
      if (interaction.message.flags.toArray().includes('Ephemeral')) return interaction.reply({ content: "You can't delete an ephemeral message silly but you can dismiss it by clicking 'Dismiss Message' below", ephemeral: true })
    
      return interaction.channel.messages.cache.get(interaction.message.id)?.delete().catch(() => {});
    } else {
      return interaction.reply({ content: "You can't delete this message", ephemeral: true })
    }
  }

  generateDefinition(messagea) {
    const customId = `${ComponentFunctions[this.name]}:${messagea}`;
    return new ButtonBuilder({
      customId,
      label: '🗑️',
      style: ButtonStyle.Danger,
    })  
  } 
}

export default DeleteInteraction;
