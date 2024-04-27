import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class MinecraftInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'minecraft',
      guild: ['906198620813008896', '816098833054302208'],
      subcommands: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    throw new Error('minecraft.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Minecraft server management')
    .addSubcommand(subcommand =>
      subcommand
        .setName('restart')
        .setDescription('Restarts the server after a 1 minute delay')
        .addBooleanOption(option =>
          option
            .setName('instantly')
            .setDescription('Should the server restart instantly?')
            .setRequired(false)
        )
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
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Gets the status of the server')
    )
    .toJSON();
}

export default MinecraftInteraction;
