import { ActionRowBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
import { TaskOptions } from '../../../../../lib/interfaces/Main.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class TaskOptionsInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TASK_OPTIONS',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: SelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const guild = interaction.customId.split(':')[1];
    const guildtasks = client.tasksdata.get(guild).tasks;
    const id = interaction.customId.split(':')[2];
    const selected = interaction.values[0];
    const task = guildtasks[id];

    await interaction.message.edit({ components: [this.generateDefinition(interaction.guild.id, id)] })
    
    if (guild !== interaction.guild.id || !task) {
      return interaction.reply({ content: 'This task does not exist', ephemeral: true });
    }

    if (selected === TaskOptions.editTask) {
      const modal = boat.interactions.modals.get('TASK_EDIT').definition(id);

      return interaction.showModal(modal);
    }

    if (selected === TaskOptions.addItem) {
      const modal = boat.interactions.modals.get('ITEM_ADD').definition(id);

      return interaction.showModal(modal);
    }

    if (selected === TaskOptions.toggleItem) {
      if (Object.values(task.items).length !== 0) {
        const row = boat.interactions.selectMenuComponents.get('ITEM_SELECT').definition(task.id, Object.values(task.items), TaskOptions.toggleItem)
        
        return interaction.reply({ content: 'Toggle item completed status', components: [row], ephemeral: true })
      } else return interaction.reply({ content: 'There are no items on this task to toggle!', ephemeral: true })
      
  
    }

    if (selected === TaskOptions.removeItem) {
      if (Object.values(task.items).length !== 0) {
        const row = boat.interactions.selectMenuComponents.get('ITEM_SELECT').definition(task.id, Object.values(task.items), TaskOptions.removeItem)
  
        return interaction.reply({ content: 'Remove item', components: [row], ephemeral: true })
      } else return interaction.reply({ content: 'There are no items on this task to remove!', ephemeral: true })
    }

    if (selected === TaskOptions.closeTask) {
      console.log(task)
    }

    return interaction.deferUpdate()
  }

  generateDefinition(guild: string, id: string): ActionRowBuilder<SelectMenuBuilder> {
    const customId = `${ComponentFunctions[this.name]}:${guild}:${id}`;
    return new ActionRowBuilder({
      components: [
        new SelectMenuBuilder()
          .setCustomId(customId)
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Edit task',
              description: 'Edit task body or title',
              value: TaskOptions.editTask,
            },
            {
              label: "Add item",
              description: "Add item from todo list",
              value: TaskOptions.addItem,
            },
            {
              label: "Toggle item",
              description: "Toggle item completed status",
              value: TaskOptions.toggleItem,
            },            
            {
              label: "Remove item",
              description: "Remove item from todo list",
              value: TaskOptions.removeItem,
            },          
            {
              label: "Edit item",
              description: "Edit item from todo list",
              value: TaskOptions.editItem,
            },
            {
              label: "Close task",
              description: "Closes task",
              value: TaskOptions.closeTask,
            },
          ]),
      ],
    });
  }
}

export default TaskOptionsInteraction;