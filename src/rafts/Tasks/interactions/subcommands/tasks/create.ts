import BaseInteraction from '../../../../BaseInteraction.js';
import * as util from 'util';
import { ChannelType, ChatInputCommandInteraction, CommandInteractionOption, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../../util/Constants.js';

class TaskCreateInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'create',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
    let channel = interaction.options.getChannel('channel', false);
    if (!channel) interaction.reply("No");

    channel = await interaction.guild.channels.fetch(channel.id);

    
    

  }
}

export default TaskCreateInteraction;
