import BaseInteraction from '../../../../BaseInteraction.js';
import * as util from 'util';
import { ActionRowBuilder, ChannelType, ChatInputCommandInteraction, CommandInteractionOption, ForumChannel, MessageActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../../util/Constants.js';

class TaskSetupInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'setup',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;

    let channel: any = interaction.options.getChannel('channel', false);
    if (!channel) channel = interaction.guild.channels.create({ name: 'tasks', type: ChannelType.GuildForum });

    const forum = await interaction.guild.channels.fetch(channel.id) as ForumChannel;
    
    client.tasksdata.set(interaction.guild.id, forum.id, 'config.channel');
    client.tasksdata.set(interaction.guild.id, {}, 'tasks');

    interaction.reply({ content: `The tasks channel has been set to ${forum.toString()}`, ephemeral: true })
  }
}

export default TaskSetupInteraction;
