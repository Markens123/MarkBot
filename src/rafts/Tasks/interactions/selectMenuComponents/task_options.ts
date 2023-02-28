import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ThreadChannel } from 'discord.js';
import { Item, Task, TaskOptions } from '../../../../../lib/interfaces/Main.js';
import { InteractionYesNo } from '../../../../util/Buttons.js';
import { ComponentFunctions, TaskMessage } from '../../../../util/Constants.js';
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

  async run(interaction: StringSelectMenuInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const guild = interaction.customId.split(':')[1];
    const id = interaction.customId.split(':')[2];
    const selected = interaction.values[0];
    const task: Task = client.tasksdata.get(guild).tasks[id];

    interaction.message.edit({ components: [this.generateDefinition(interaction.guild.id, task)] })
    
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

    if (selected === TaskOptions.editItem) {
      if (Object.values(task.items).length !== 0) {
        const row = boat.interactions.selectMenuComponents.get('ITEM_SELECT').definition(task.id, Object.values(task.items), TaskOptions.editItem)
  
        return interaction.reply({ content: 'Edit item', components: [row], ephemeral: true })
      } else return interaction.reply({ content: 'There are no items on this task to edit!', ephemeral: true })
    }    

    if (selected === TaskOptions.closeTask) {
      await interaction.deferReply({ ephemeral: true });
      if (Object.values(task.items).filter((x: Item) => x.completed).length !== Object.values(task.items).length) {
        const resp = await InteractionYesNo({ 
          interaction, 
          options: {
            content: 'Are you sure that you want to close this task? (Some items are not completed)'
          }, 
          editReply: true 
        })
        if (!resp) return interaction.editReply({ content: 'Close canceled!', components: [] })
      }
      const ntask: Task = {
        ...task,
        open: false
      }
      const channel = await interaction.guild.channels.fetch(ntask.message_id) as ThreadChannel;

      await (await channel.messages.fetch(ntask.message_id)).edit({ 
        content: TaskMessage(ntask), 
        components: [this.generateDefinition(interaction.guild.id, ntask)] 
      })

      client.tasksdata.set(interaction.guild.id, ntask, `tasks.${task.id}`);

      await interaction.editReply({ content: 'Task closed!', components: [] })

      return interaction.channel.send({ content: `Task closed by ${interaction.user.toString()}`});
    }

    if (selected === TaskOptions.openTask) {
      if (task.open) {
        return interaction.reply({content: 'This task is already opened!', ephemeral: true})
      }

      const ntask: Task = {
        ...task,
        open: true
      }
      const channel = await interaction.guild.channels.fetch(ntask.message_id) as ThreadChannel;

      await (await channel.messages.fetch(ntask.message_id)).edit({ 
        content: TaskMessage(ntask), 
        components: [this.generateDefinition(interaction.guild.id, ntask)] 
      })

      client.tasksdata.set(interaction.guild.id, ntask, `tasks.${task.id}`);

      return interaction.reply({ content: `Task opened by ${interaction.user.toString()}`});
    } 

    return interaction.deferUpdate()
  }

  generateDefinition(guild: string, task: Task): ActionRowBuilder<StringSelectMenuBuilder> {
    const customId = `${ComponentFunctions[this.name]}:${guild}:${task.id}`;

    if (!task.open) {
      return new ActionRowBuilder({
        components: [
          new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder('Nothing selected')
            .addOptions([
              {
                label: "Open task",
                description: "Opens task",
                value: TaskOptions.openTask,
              },
            ]),
        ],
      });
    }

    return new ActionRowBuilder({
      components: [
        new StringSelectMenuBuilder()
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
              description: "Add item to todo list",
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
              description: "Edit todo list item",
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