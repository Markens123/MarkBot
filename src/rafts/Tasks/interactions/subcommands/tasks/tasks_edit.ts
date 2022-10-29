import BaseInteraction from '../../../../BaseInteraction.js';
import { ChatInputCommandInteraction } from 'discord.js';

class TaskEditInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'edit',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const id = interaction.options.getString('id');

    if (!client.tasksdata.get(interaction.guild.id)?.config.channel) {
      return interaction.reply({ content: "Tasks are not setup for this server yet!", ephemeral: true });
    }

    const modal = boat.interactions.modals.get('TASK_EDIT').definition(id);

    return interaction.showModal(modal);
  }
}

export default TaskEditInteraction;
