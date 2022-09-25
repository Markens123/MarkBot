import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { Task } from '../../../../../lib/interfaces/Main.js';
import { ModalComponents, ModalFunctions, TaskMessage } from '../../../../util/Constants.js';

class TaskEditModalInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TASK_EDIT',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const client = this.boat.client;
    const title = interaction.fields.getTextInputValue('title');
    const body = interaction.fields.getTextInputValue('body');
    const id = interaction.customId.split(':')[1];
    const task = client.tasksdata.get(interaction.guild.id).tasks[id];

    if (!body && !title) {
      return interaction.reply({ content: 'You must edit one of the fields!' ,ephemeral: true})
    }

    if (!task) {
      return interaction.reply({ content: 'That task does not exist', ephemeral: true })
    }

    const ntask: Task = {
      ...task,
      body: body || task.body,
      title: title ?? task.title,
    }

    const channel = await interaction.guild.channels.fetch(ntask.message_id) as ThreadChannel;

    await channel.edit({ name: ntask.title })

    await (await channel.messages.fetch(ntask.message_id)).edit({ content: TaskMessage(ntask) })

    client.tasksdata.set(interaction.guild.id, ntask, `tasks.${ntask.id}`);

    interaction.reply({ content: `Task has been edited! ${channel.toString()}`, ephemeral: true })
  }

  generateDefinition(id: string): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(`${ModalFunctions[this.name]}:${id}`).setTitle('Edit Task');

    const titleInput = new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Title')
      .setPlaceholder('This is a super cool title')
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

      const bodyInput = new TextInputBuilder()
      .setCustomId('body')
      .setLabel('Body')
      .setPlaceholder('Super cool stuff to do')
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

      modal.addComponents(...ModalComponents([titleInput, bodyInput]));

      return modal;
  }
}

export default TaskEditModalInteraction;
