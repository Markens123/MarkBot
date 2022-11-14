import { ChannelType, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class AnimeAlertsInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'animealerts',
      guild: '816098833054302208',
      enabled: true,
      subcommands: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run() {
    throw new Error('animealerts.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('animealerts')
    .setDescription('Manage anime alerts for this server')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('conifg')
        .setDescription('View the config for this server')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Sets up anime alerts for this server')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel that all alerts will go to')
            .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.GuildAnnouncement)
            .setRequired(true)
          )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new anime alert to this server')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Name of the anime')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove anime from alerts')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription("Name of the anime to remove (use the same name that's in the config)")
            .setRequired(true)
          )
    )
}

export default AnimeAlertsInteraction;
