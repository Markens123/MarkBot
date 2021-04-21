'use strict';

const BaseInteraction = require('../../../BaseInteraction');

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
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction, args) {
    const client = this.boat.client;
    let c = args?.find(arg => arg.name === `content`)?.value;

    interaction.reply(c, {ephemeral: true});
  }
}

module.exports = EphemeralInteraction;
