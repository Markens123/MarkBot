'use strict';

const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'shrug',
  description: 'Just shrug'
};

class ShrugInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'shrug',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    
    interaction.reply('¯\\_(ツ)_/¯');
  }
}

module.exports = ShrugInteraction;
