import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'ephemeral',
  description: 'Sends an ephemeral message with custom content',
  options: [
    {
        name: "content",
        description: "The message content.",
        type: 3,
        required: true
    }
    ]    
};

class EphemeralInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'ephemeral',
      guild: ['274765646217216003', '816098833054302208'],      
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction, args: any) {
    let c = args.find(arg => arg.name === `content`).value;

    interaction.reply({ content: c, ephemeral: true });
  }
}

export default EphemeralInteraction;
