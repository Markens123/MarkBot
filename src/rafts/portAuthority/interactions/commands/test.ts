import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { ChatInputCommandInteraction, CommandInteractionOption, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../util/Constants.js';

class TestInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'test',
      enabled: true,      
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
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
  return new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test stuff')
    .addStringOption(option =>
      option
        .setName('string')
        .setDescription('Sequence of characters')
    )
    .addIntegerOption(option =>
      option
        .setName('integer')
        .setDescription('Whole numbers')
    )
    .addBooleanOption(option => 
      option
        .setName('boolean')
        .setDescription('True or false')
    )
    .addUserOption(option => 
      option
        .setName('user')
        .setDescription('Any user (can use id)')
    )
    .addChannelOption(option => 
      option
        .setName('channel')
        .setDescription('Channel that is in this server')
    )
    .addRoleOption(option =>
       option
        .setName('role')
        .setDescription('Role that is in this server')
    )
    .addMentionableOption(option =>
      option
        .setName('mentionable')
        .setDescription('Anything that you can mention')
    )
    .addNumberOption(option =>
      option
        .setName('number')
        .setDescription('Any number')
    )
    .addAttachmentOption(option =>
      option
      .setName('attachment')
      .setDescription('An attachment')
    )
    .addStringOption(option =>
      option
        .setName('response')
        .setDescription('The response')
        .addChoices({ name: 'Modal', value: 'modal' })
    )
    .toJSON();
}

export default TestInteraction;
