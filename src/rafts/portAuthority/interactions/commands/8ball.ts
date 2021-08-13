import ball from '8ball.js';
import { CommandInteraction } from 'discord.js';

import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: '8ball',
  description: 'The Magic 8 Ball Oracle has answers to all the questions',
  options: [
    {
        name: "question",
        description: "Question to ask",
        type: 3,
        required: true
    }
    ]  
};

class EBallInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: '8ball',
      guild: '274765646217216003',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction) {
    interaction.reply(ball());
  }
}

export default EBallInteraction;
