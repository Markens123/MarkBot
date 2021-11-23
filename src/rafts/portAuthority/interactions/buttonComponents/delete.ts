import { ButtonInteraction, Snowflake, MessageButton } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ComponentFunctions } from '../../../../util/Constants.js';

class DeleteInteraction extends BaseInteraction {
  
  definition: (user: Snowflake) => MessageButton;
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
      //@ts-expect-error
      if (interaction.message.flags.toArray().includes('EPHEMERAL')) return interaction.reply({ content: "You can't delete an ephemeral message silly but you can dismiss it by clicking 'Dismiss Message' below", ephemeral: true })
    
      return interaction.channel.messages.cache.get(interaction.message.id)?.delete().catch(() => {});
    }

  }

  generateDefinition(messagea) {
    const customId = `${ComponentFunctions[this.name]}:${messagea}`;
    return new MessageButton({
      customId,
      label: '🗑️',
      style: 'DANGER',
    })  
  } 
}

export default DeleteInteraction;
