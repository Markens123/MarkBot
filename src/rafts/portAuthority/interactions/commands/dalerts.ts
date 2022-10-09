import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class DAlertsInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'dalerts',
      disabled: true,
      guild: '816098833054302208',
      subcommands: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    throw new Error('dalerts.ts was ran but should never be run')
  }
}

function getDefinition() {
  const choices = [
    {
      name: 'PTB',
      value: 'ptb'
    },
    {
      name: 'Stable',
      value: 'stable'
    },
    {
      name: 'Canary',
      value: 'canary'
    },
  ];

  return new SlashCommandBuilder()
    .setName('dalerts')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages)
    .setDescription('Discord alerts config')
    .addSubcommand(commmand =>
      commmand
        .setName('set')
        .setDescription('Set alerts for a specific channel')
        .addStringOption(option =>
          option
            .setName('branch')
            .setDescription('Branch to notify about')
            .addChoices(...choices)
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to send alerts to')
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText, ChannelType.PrivateThread, ChannelType.PublicThread)
            .setRequired(false)
        )
        .addBooleanOption(option =>
          option
            .setName('remove')
            .setDescription('Remove the alerts for this branch?')
        )
    )
    .addSubcommand(commmand =>
      commmand
        .setName('role')
        .setDescription("Set roles mention for a branch's alert")
        .addStringOption(option =>
          option
            .setName('branch')
            .setDescription('Branch to notify about')
            .addChoices(...choices)
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to mention with alerts')
            .setRequired(false)
        )
        .addBooleanOption(option =>
          option
            .setName('remove')
            .setDescription('Remove the role mention for this branch?')
        )
    )    
    .addSubcommand(command =>
      command
        .setName('config')
        .setDescription('View the config of this server')
    )
    .toJSON();
}

export default DAlertsInteraction;
