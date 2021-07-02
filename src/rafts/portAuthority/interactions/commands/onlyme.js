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
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    interaction.reply({ content: 'Only you can see this\\😄', ephemeral: true});
  }
}

module.exports = OnlyMeInteraction;
