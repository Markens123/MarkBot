import BaseInteraction from '../../../BaseInteraction.js';
import { SlashCommandBuilder } from 'discord.js';

class FunctionsInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'functions',
      enabled: true,
      guild: '816098833054302208',
      subcommands: true,
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run() {
    throw new Error('functions.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('functions')
    .setDescription('Functions management')
    .addSubcommand(subcommand =>
      subcommand
        .setName('deploy')
        .setDescription('Deploy a new function')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Name of the function')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
          .setName('path')
          .setDescription('Path to project start')
          .setRequired(true)
          )
          .addBooleanOption(option =>
            option
              .setName('build')
              .setDescription('Should this project run build')
              .setRequired(false)
          )
          .addBooleanOption(option =>
            option
              .setName('env')
              .setDescription('Should we valk you though the env gen')
              .setRequired(false)
          )
          .addStringOption(option =>
          option
            .setName('flags')
            .setDescription('Flags for the command')
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('github')
            .setDescription('Github url for the project (use this or upload project)')
            .setRequired(false)
        )
        .addAttachmentOption(option =>
          option
            .setName('project')
            .setDescription('Zip file of project (use this or github url)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
          .setName('list')
          .setDescription('List all functions')
      )
    .toJSON();
}

export default FunctionsInteraction;
