import { AttachmentBuilder, ForumChannel, ModalSubmitInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { Task } from '../../../../../lib/interfaces/Main.js';

class TaskCreateModalInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TASK_CREATE',
      enabled: true,
    };
    super(raft, info);
  }

  async run(interaction: ModalSubmitInteraction) {
    const client = this.boat.client;
    const title = interaction.fields.getTextInputValue('title');
    const body = interaction.fields.getTextInputValue('body');
    const fourm = await interaction.guild.channels.fetch(client.tasksdata.get(interaction.guild.id).config.channel) as ForumChannel;

    client.tasksdata.ensure(interaction.guild.id, [], 'tasks');

    const task: Task = {
      author: interaction.user.id,
      body,
      title,
      id: Math.floor(Date.now() * Math.random()).toString(),
      open: true,
      items: [],
    }

    client.tasksdata.push(interaction.guild.id, task, 'tasks');
    
    const channel = await fourm.threads.create({
      name: task.title,
      message: {
        content: `${task.body}\n--------------------\nID: ${task.id}`
      },
    })

    await channel.members.add(interaction.user)

    interaction.reply({ content: `New task created! ${channel.toString()}`, ephemeral: true })


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


export default TaskCreateModalInteraction;
