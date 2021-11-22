import { ContextMenuInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class GuessInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'Guess',
      enabled: true,
      type: 'MESSAGE',
    };
    super(raft, info);
  }

  async run(interaction: ContextMenuInteraction) {
    return interaction.reply('No :P')
  }
}


export default GuessInteraction;
