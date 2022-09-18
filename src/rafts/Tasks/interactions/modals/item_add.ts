import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { Item, Task } from '../../../../../lib/interfaces/Main.js';
import { ModalComponents, ModalFunctions, TaskMessage } from '../../../../util/Constants.js';

class ItemAddModalInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ITEM_ADD',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const client = this.boat.client;
    const body = interaction.fields.getTextInputValue('body');
    const id = interaction.customId.split(':')[1];
    const guildtasks = client.tasksdata.get(interaction.guild.id).tasks;
    const task: Task = guildtasks[id];

    if (!task) {
      return interaction.reply({ content: 'That task does not exist', ephemeral: true })
    }

    const item: Item = {
      body,
      completed: false,
      id: Math.floor(Date.now() * Math.random()).toString(),
      task_id: task.id
    }

    client.tasksdata.set(interaction.guild.id, item, `tasks.${task.id}.items.${item.id}`);

    const ntask = client.tasksdata.get(interaction.guild.id).tasks[id];

    const channel = await interaction.guild.channels.fetch(task.message_id) as ThreadChannel;
    
    await (await channel.messages.fetch(task.message_id)).edit({ content: TaskMessage(ntask.body, ntask.id, ntask.items) })
    
    interaction.reply({ content: `Item has been added! ${channel.toString()}`, ephemeral: true })
  }

  generateDefinition(id: string): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(`${ModalFunctions[this.name]}:${id}`).setTitle('Add Item');

    const bodyInput = new TextInputBuilder()
      .setCustomId('body')
      .setLabel('Body')
      .setPlaceholder('We need to add super cool stuff now!!!')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

      modal.addComponents(...ModalComponents([bodyInput]));

      return modal;
  }
}

export default ItemAddModalInteraction;
