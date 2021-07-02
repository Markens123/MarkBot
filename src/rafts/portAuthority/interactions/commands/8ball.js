'use strict';
const ball = require("8ball.js");

const BaseInteraction = require('../../../BaseInteraction');

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

  async run(interaction) {
    interaction.reply(ball());
  }
}

module.exports = EBallInteraction;
