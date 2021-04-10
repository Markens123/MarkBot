'use strict';
const ball = require("8ball.js");

const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'avatar',
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
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;

    interaction.reply(ball());
  }
}

module.exports = EBallInteraction;
