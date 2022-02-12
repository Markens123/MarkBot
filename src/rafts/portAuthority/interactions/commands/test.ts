import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { CommandInteraction, CommandInteractionOption } from 'discord.js';
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

  async run(interaction: CommandInteraction, args: CommandInteractionOption[]) {
    const resp = args?.find(arg => arg.name === `response`)?.value;
    const client = interaction.client;

    if (resp === 'modal') {
      //@ts-expect-error
      return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 9,
        data: {
          custom_id: 'test',
          title: 'Test Modal!',
          components: [
            {
              type: 1,
              components: [
                {
                  type: 4,
                  custom_id: "name",
                  label: "Name",
                  style: 1,
                  min_length: 1,
                  max_length: 4000,
                  placeholder: "John",
                  required: true
                },
              ]              
            },
            {
              type: 1,
              components: [
                {
                  type: 4,
                  custom_id: "age",
                  label: "Age",
                  style: 1,
                  min_length: 1,
                  max_length: 4,
                  placeholder: "21",
                  required: false                 
                }                
              ]
            },
            {
              type: 1,
              components: [
                {
                  type: 4,
                  custom_id: "hud",
                  label: "How are you doing today?",
                  style: 2,
                  min_length: 1,
                  max_length: 4000,
                  placeholder: "I'm doing fine!",
                  required: false                 
                },                
              ]
            }
          ]
        }
      }})
    } 

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
      {
        name: "response",
        description: "The response",
        type: 3,
        required: false,
        choices: [
          {
            name: "Modal",
            value: "modal"
          }
        ]
      }
    ] 
    } 
}
export default TestInteraction;
