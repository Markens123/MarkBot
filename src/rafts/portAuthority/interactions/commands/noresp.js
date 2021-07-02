'use strict';

const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'noresp',
  description: "This won't send a response"
};

class NoRespInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'noresp',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run() {}
}

module.exports = NoRespInteraction;
