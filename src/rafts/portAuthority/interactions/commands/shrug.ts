import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'shrug',
  description: 'Just shrug'
};

class ShrugInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'shrug',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction) {
    interaction.reply('¯\\_(ツ)_/¯');
  }
}

export default ShrugInteraction;
