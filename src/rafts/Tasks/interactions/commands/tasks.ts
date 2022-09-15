import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';
import { ChatInputCommandInteraction, CommandInteractionOption, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalComponents, ModalFunctions } from '../../../../util/Constants.js';

class TaskInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'tasks',
      enabled: true,
      guild: '816098833054302208',
      subcommands: true,
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('tasks')
    .setDescription('Tasks stuff')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup tasks for this server')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('config')
        .setDescription('Edit the tasks config for this server')
    )    
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Creates a new task')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edits an existing task')
        .addStringOption(option =>
          option 
            .setName('id')
            .setDescription('The task id to edit')
        )
    )    
    .toJSON();
}

export default TaskInteraction;
