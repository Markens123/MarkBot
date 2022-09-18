import BaseInteraction from '../../../../BaseInteraction.js';
import { ChatInputCommandInteraction, CommandInteractionOption } from 'discord.js';

class TaskCreateInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'create',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
    const boat = this.boat;
    const client = boat.client;

    if (!client.tasksdata.get(interaction.guild.id)?.config.channel) {
      return interaction.reply({ content: "Tasks are not setup for this server yet!", ephemeral: true });
    }

    const modal = boat.interactions.modals.get('TASK_CREATE').definition();

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
