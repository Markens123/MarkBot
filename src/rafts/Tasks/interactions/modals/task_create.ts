import { ForumChannel, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { Task } from '../../../../../lib/interfaces/Main.js';
import { ModalComponents, ModalFunctions, TaskMessage } from '../../../../util/Constants.js';

class TaskCreateModalInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TASK_CREATE',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const title = interaction.fields.getTextInputValue('title');
    const body = interaction.fields.getTextInputValue('body');
    const fourm = await interaction.guild.channels.fetch(client.tasksdata.get(interaction.guild.id).config.channel) as ForumChannel;

    client.tasksdata.ensure(interaction.guild.id, {}, 'tasks');

    const task: Task = {
      author: interaction.user.id,
      body,
      title,
      id: Math.floor(Date.now() * Math.random()).toString(),
      open: true,
      items: [],
    }
    
    const channel = await fourm.threads.create({
      name: task.title,
      message: {
        content: TaskMessage(task.body, task.id, []),
        components: [boat.interactions.selectMenuComponents.get('TASK_OPTIONS').definition(interaction.guild.id, task.id)]
      },
    })

    task.message_id = channel.id;
    
    client.tasksdata.set(interaction.guild.id, task, `tasks.${task.id}`);
    await channel.members.add(interaction.user);

    interaction.reply({ content: `New task created! ${channel.toString()}`, ephemeral: true });
  }

  generateDefinition(): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(`${ModalFunctions[this.name]}:`).setTitle('Create Task');

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

      return modal;
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
