'use strict';

import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { CommandInteraction } from 'discord.js';
const definition = getDefinition()

class TestInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'test',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction, args: any) {
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
      },
      {
          name: "mentionable",
          description: "Anything that you can mention",
          type: 9,
          required: false
      },
      {
        name: "number",
        description: "A number",
        type: 10,
        required: false
      },      
    ] 
    } 
}
export default TestInteraction;
