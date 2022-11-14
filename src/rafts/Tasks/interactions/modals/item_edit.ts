import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { Item, Task } from '../../../../../lib/interfaces/Main.js';
import { ModalComponents, ModalFunctions, TaskMessage } from '../../../../util/Constants.js';

class ItemEditModalInteraction extends BaseInteraction {
  definition: (task_id: string, item_id: string, body: string) => ModalBuilder;

  constructor(raft) {
    const info = {
      name: 'ITEM_EDIT',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const client = this.boat.client;
    const body = interaction.fields.getTextInputValue('body');
    const taskId = interaction.customId.split(':')[1];
    const itemId = interaction.customId.split(':')[2];
    const task: Task = client.tasksdata.get(interaction.guild.id).tasks[taskId];
    const item: Item = task.items[itemId];

    if (!task || !item) {
      return interaction.reply({ content: 'That item does not exist', ephemeral: true })
    }

    const nitem: Item = {
      ...item,
      body: body || item.body
    }

    client.tasksdata.set(interaction.guild.id, nitem, `tasks.${task.id}.items.${item.id}`);

    const ntask = client.tasksdata.get(interaction.guild.id).tasks[taskId];

    const channel = await interaction.guild.channels.fetch(task.message_id) as ThreadChannel;
    
    await (await channel.messages.fetch(task.message_id)).edit({ content: TaskMessage(ntask) })
    
    interaction.reply({ content: 'Item edited!', ephemeral: true })
  }

  generateDefinition(task_id: string, item_id: string, body: string): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(`${ModalFunctions[this.name]}:${task_id}:${item_id}`).setTitle('Add Item');

    const bodyInput = new TextInputBuilder()
      .setCustomId('body')
      .setLabel('Body')
      .setPlaceholder('We need to add super cool stuff now!!!')
      .setRequired(true)
      .setValue(body)
      .setStyle(TextInputStyle.Short);

      modal.addComponents(...ModalComponents([bodyInput]));

      return modal;
  }
}

export default ItemEditModalInteraction;
