import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { CommandInteraction, CommandInteractionOption, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../util/Constants.js';
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
      const modal = new ModalBuilder().setCustomId(`${ModalFunctions['TEST']}:`).setTitle('Test Modal!');

      const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Name')
      .setRequired(true)
      .setPlaceholder('Josh')
      .setStyle(TextInputStyle.Short);

      const ageInput = new TextInputBuilder()
      .setCustomId('age')
      .setLabel('Age')
      .setRequired(false)
      .setPlaceholder('21')
      .setStyle(TextInputStyle.Short);
      
      const hruInput = new TextInputBuilder()
      .setCustomId('hru')
      .setLabel('How are you doing today?')
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

      modal.addComponents(...ModalComponents([nameInput, ageInput, hruInput]));

      return interaction.showModal(modal);
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
