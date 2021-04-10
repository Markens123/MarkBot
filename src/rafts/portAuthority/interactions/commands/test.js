'use strict';

const BaseInteraction = require('../../../BaseInteraction');
const util = require('util');
const definition = getDefinition()

class TestInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'test',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction, args) {
    const client = this.boat.client;
    
    interaction.reply(`\`\`\`js\n${util.inspect(args)}\`\`\``);
  }
}

function getDefinition() {
  return {
  name: "test",
  description: "Test stuff",
  options: [
      {
          name: "string",
          description: "Sequence of characters",
          type: 3,
          required: false
      },
      {
          name: "integer",
          description: "Whole numbers",
          type: 4,
          required: false
      },
      {
          name: "boolean",
          description: "True or false",
          type: 5,
          required: false
      },
      {
          name: "user",
          description: "User that is in this server",
          type: 6,
          required: false
      },
      {
          name: "channel",
          description: "Channel that is in this server",
          type: 7,
          required: false
      },
      {
          name: "role",
          description: "Role that is in this server",
          type: 8,
          required: false
      }                                                                                        
                                                                                                  

      ] 
    } 
}
module.exports = TestInteraction;
