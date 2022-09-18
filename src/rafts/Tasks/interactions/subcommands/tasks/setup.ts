import BaseInteraction from '../../../../BaseInteraction.js';
import * as util from 'util';
import { ActionRowBuilder, ChannelType, ChatInputCommandInteraction, CommandInteractionOption, ForumChannel, MessageActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ThreadChannel } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../../util/Constants.js';

class TaskSetupInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'create',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
    const boat = this.boat;
    const client = boat.client;

    let channel = interaction.options.getChannel('channel', false);
    if (!channel) return interaction.reply("No");

    const fourm = await interaction.guild.channels.fetch(channel.id) as ForumChannel;
    
    client.tasksdata.set(interaction.guild.id, fourm.id, 'config.channel');
    client.tasksdata.set(interaction.guild.id, [], 'tasks');

    interaction.reply({ content: `The tasks channel has been set to ${fourm.toString()}`, ephemeral: true })
  }
}

export default TaskSetupInteraction;
