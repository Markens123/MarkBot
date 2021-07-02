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
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    interaction.reply('¯\\_(ツ)_/¯');
  }
}

module.exports = ShrugInteraction;
