import { ActionRowBuilder, SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuInteraction, ThreadChannel } from 'discord.js';
import { Item, Task } from '../../../../../lib/interfaces/Main.js';
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

  async run(interaction: SelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const data = interaction.customId.split(':');
    const id = data[1];
    const next = data[2];
    const selected = interaction.values[0];
    const task = client.tasksdata.get(interaction.guild.id).tasks[id] as Task;

    if (!task) {
      return interaction.reply({ content: 'This task does not exist', ephemeral: true });
    }

    await interaction.update({ components: [this.generateDefinition(id, Object.values(task.items), next)] });
    
    const item = task.items[selected] as Item;

    if (next === 'mark') {
      let newitem: Item = {
        ...item,
        completed: !item.completed
      }

      client.tasksdata.set(interaction.guild.id, newitem, `tasks.${task.id}.items.${item.id}`);

      const channel = await interaction.guild.channels.fetch(task.message_id) as ThreadChannel;

      const newtask = client.tasksdata.get(interaction.guild.id).tasks[id];
    
      return await (await channel.messages.fetch(task.message_id)).edit({ content: TaskMessage(newtask) });
    }

    return interaction.deferUpdate()
  }

  generateDefinition(task_id: string, items: Item[], next: string): ActionRowBuilder<SelectMenuBuilder> {
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
        new SelectMenuBuilder()
          .setCustomId(customId)
          .setPlaceholder('Nothing selected')
          .addOptions(options),
      ],
    });
  }
}

export default ItemSelectInteraction;