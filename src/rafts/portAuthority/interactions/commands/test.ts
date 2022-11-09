import { ChatInputCommandInteraction, CommandInteractionOption, SlashCommandBuilder } from 'discord.js';
import * as util from 'util';
import BaseInteraction from '../../../BaseInteraction.js';

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
    const resp = interaction.options.getString('response', false);

    if (resp === 'modal') {
      const modal = this.boat.interactions.modals.get('TEST').definition();

      return interaction.showModal(modal);
    } else if (resp === 'buttons') {
      const buttons = this.boat.interactions.buttonComponents.get('TEST_BUTTONS').definition();
      return interaction.reply({content: 'Buttons!', components: buttons });
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
        .addChoices(
          {
            name: 'Modal',
            value: 'modal'
          },
          {
            name: 'Buttons',
            value: 'buttons'
          }
        )
    )
    .toJSON();
}

export default TestInteraction;
