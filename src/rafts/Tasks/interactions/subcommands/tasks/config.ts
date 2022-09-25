import BaseInteraction from '../../../../BaseInteraction.js';
import { ChatInputCommandInteraction, CommandInteractionOption, ForumChannel } from 'discord.js';

class TaskConfigInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'config',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    let channel: any = interaction.options.getChannel('channel', false);

    if (!interaction.memberPermissions.has('Administrator')) {
      return interaction.reply({ content: 'Only Admins can use this command!', ephemeral: true })
    }

    if (!client.tasksdata.get(interaction.guild.id)?.config.channel) {
      return interaction.reply({ content: 'Tasks are not setup for this server yet! Use the setup command instead.', ephemeral: true });
    }


    if (!channel) {
      return interaction.reply({ content: 'No options provided to edit!', ephemeral: true })
    } else {
    const forum = await interaction.guild.channels.fetch(channel.id) as ForumChannel;

    client.tasksdata.set(interaction.guild.id, forum.id, 'config.channel');
    }

    return interaction.reply({content: 'Config Updated!', ephemeral: true})
  }
}

export default TaskConfigInteraction;
