import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class PalworldInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'palworld',
      guild: ['906198620813008896', '816098833054302208'],
      subcommands: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    throw new Error('palworld.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('palworld')
    .setDescription('Palworld server management')
    .addSubcommand(subcommand =>
      subcommand
        .setName('backup')
        .setDescription('Creates a backup of the server')  
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('restart')
        .setDescription('Restarts the server')  
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Starts the server')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('Stops the server')
    )
    .toJSON();
}

export default PalworldInteraction;
