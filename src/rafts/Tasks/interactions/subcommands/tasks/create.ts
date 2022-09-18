import BaseInteraction from '../../../../BaseInteraction.js';
import * as util from 'util';
import { ActionRowBuilder, ChannelType, ChatInputCommandInteraction, CommandInteractionOption, ForumChannel, MessageActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../../util/Constants.js';

class TaskCreateInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'create',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
    const client = this.boat.client;

    if (!client.tasksdata.get(interaction.guild.id)?.config.channel) {
      return interaction.reply({ content: "Tasks are not setup for this server yet!", ephemeral: true });
    }

    const modal = new ModalBuilder().setCustomId(`${ModalFunctions['TASK_CREATE']}:`).setTitle('Create Task');

    const titleInput = new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Title')
      .setPlaceholder('This is a super cool title')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

      const bodyInput = new TextInputBuilder()
      .setCustomId('body')
      .setLabel('Body')
      .setPlaceholder('Super cool stuff to do')
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

      modal.addComponents(...ModalComponents([titleInput, bodyInput]));

      return interaction.showModal(modal);
  }
}


const demo_ta = {
  '816098833054302208': { // Guild id
    config: {
      channel: '1019638215017238588'
    }, 
    tasks: [
      
    ] // Array of tasks
  }
}

export default TaskCreateInteraction;
