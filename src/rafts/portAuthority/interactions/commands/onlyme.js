'use strict';

const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'onlyme',
  description: 'Sends an ephemeral message which only you can see'
};

class OnlyMeInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'onlyme',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    
    interaction.reply('Only you can see this\\😄', {ephemeral: true});
  }
}

module.exports = OnlyMeInteraction;
