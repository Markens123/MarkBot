import { ActionRowBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js';
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

    interaction.message.edit({ components: [this.generateDefinition(interaction.guild.id, id)] })
    
    if (guild !== interaction.guild.id || !task) {
      return interaction.reply({ content: 'This task does not exist', ephemeral: true });
    }

    if (selected === 'edit_task') {
      const modal = boat.interactions.modals.get('TASK_EDIT').definition(id);

      return interaction.showModal(modal);
    }

    if (selected === 'add_item') {
      const modal = boat.interactions.modals.get('ITEM_ADD').definition(id);

      return interaction.showModal(modal);
    }

    if (selected === 'mark_item') {
      const row = boat.interactions.selectMenuComponents.get('ITEM_SELECT').definition(task.id, Object.values(task.items), 'mark')
      
      return interaction.reply({ components: [row], ephemeral: true })
    }

    if (selected === 'close_task') {
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
              value: 'edit_task',
            },
            {
              label: "Add item",
              description: "Add item from todo list",
              value: 'add_item',
            },
            {
              label: "Mark item",
              description: "Mark item as completed or not",
              value: 'mark_item',
            },            
            {
              label: "Remove item",
              description: "Remove item from todo list",
              value: 'remove_item',
            },          
            {
              label: "Edit item",
              description: "Edit item from todo list",
              value: 'edit_item',
            },
            {
              label: "Close task",
              description: "Closes task",
              value: 'close_task',
            },
          ]),
      ],
    });
  }
}

export default TaskOptionsInteraction;