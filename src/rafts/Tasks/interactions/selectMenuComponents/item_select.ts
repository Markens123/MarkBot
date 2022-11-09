import { ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, StringSelectMenuInteraction, ThreadChannel } from 'discord.js';
import { Item, Task, TaskOptions } from '../../../../../lib/interfaces/Main.js';
import { InteractionYesNo } from '../../../../util/Buttons.js';
import { ComponentFunctions, TaskMessage } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class ItemSelectInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ITEM_SELECT',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: StringSelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const data = interaction.customId.split(':');
    const id = data[1];
    const next = data[2];
    const selected = interaction.values[0];
    const task: Task = client.tasksdata.get(interaction.guild.id).tasks[id];

    if (!task) {
      return interaction.reply({ content: 'This task does not exist', ephemeral: true });
    }

    const item = task.items[selected] as Item;
    const channel = await interaction.guild.channels.fetch(task.message_id) as ThreadChannel;

    if (next === TaskOptions.toggleItem) {
      if (Object.values(task.items).length !== 0) {
        await interaction.update({ components: [this.generateDefinition(id, Object.values(task.items), next)] });
      } else {
        return await interaction.update({ content: 'No items present. Add some with the menu above!', components: null });
      }
      
      let newitem: Item = {
        ...item,
        completed: !item.completed
      }

      client.tasksdata.set(interaction.guild.id, newitem, `tasks.${task.id}.items.${item.id}`);

      const newtask = client.tasksdata.get(interaction.guild.id).tasks[id];

      interaction.editReply({ content: 'Item status toggled\n Select new item to toggle:' });
    
      return await (await channel.messages.fetch(task.message_id)).edit({ content: TaskMessage(newtask) });
    }
    
    if (next === TaskOptions.removeItem) {
      if (Object.values(task.items).length !== 0) {
        await interaction.update({ components: [this.generateDefinition(id, Object.values(task.items), next)] });
      } else {
        return await interaction.update({ content: 'No items present. Add some with the menu above!', components: null });
      }

      const resp = await InteractionYesNo({
        interaction,
        content: `Are you sure that you want to delete the item \`${item.body}\`?`,
        editReply: false
      });

      if (resp) {
        client.tasksdata.delete(interaction.guild.id, `tasks.${task.id}.items.${item.id}`);
      
        interaction.editReply({ content: 'Item removed\n Select new item to remove:' });
    
        const newtask = client.tasksdata.get(interaction.guild.id).tasks[id];

        await (await channel.messages.fetch(task.message_id)).edit({ content: TaskMessage(newtask) });

        if (Object.values(newtask.items).length !== 0) {
          return interaction.editReply({ components: [this.generateDefinition(id, Object.values(newtask.items), next)] })
        } else return interaction.editReply({ content: 'No more items present. Add some with the menu above!', components: [] });
  
      } else {
        return interaction.editReply({ content: 'Operation canceled\n Select new item to remove:' });
      }
    }

    if (next === TaskOptions.editItem) {
      const modal = boat.interactions.modals.get('ITEM_EDIT').definition(task.id, item.id, item.body);

      await interaction.showModal(modal);

      if (Object.values(task.items).length !== 0) {
        await interaction.editReply({ components: [this.generateDefinition(id, Object.values(task.items), next)] });
      } else {
       await interaction.editReply({ content: 'No items present. Add some with the menu above!', components: null });
      }
      return      
    }

    return interaction.deferUpdate()
  }

  generateDefinition(task_id: string, items: Item[], next: TaskOptions): ActionRowBuilder<StringSelectMenuBuilder> {
    const customId = `${ComponentFunctions[this.name]}:${task_id}:${next}`;
    const options: SelectMenuComponentOptionData[] = [];

    items.forEach(i => {
      options.push({
        label: i.body,
        value: i.id
      })
    })
    
    return new ActionRowBuilder({
      components: [
        new StringSelectMenuBuilder()
          .setCustomId(customId)
          .setPlaceholder('Nothing selected')
          .addOptions(options),
      ],
    });
  }
}

export default ItemSelectInteraction;