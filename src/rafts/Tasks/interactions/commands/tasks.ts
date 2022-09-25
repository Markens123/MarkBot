import BaseInteraction from '../../../BaseInteraction.js';
import { SlashCommandBuilder } from 'discord.js';

class TaskInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'tasks',
      enabled: true,
      guild: '816098833054302208',
      subcommands: true,
      definition: tempDef(),
    };
    super(boat, info);
  }

  async run() {
    throw new Error(`tasks.ts was ran but should never be run`)
  }
}
 
function tempDef() { 
return {
  name: 'tasks',
  description: 'Tasks stuff',
  options: [
    {
      type: 1,
      name: 'setup',
      name_localizations: undefined,
      description: 'Setup tasks for this server',
      description_localizations: undefined,
      options: [
        {
          required: false,
          type: 7,
          name: 'channel',
          channel_types: [ 15 ],
          description: 'Channel to make tasks forum'
        }
      ]
    },
    {
      type: 1,
      name: 'config',
      name_localizations: undefined,
      description: 'Edit the tasks config for this server',
      description_localizations: undefined,
      options: [
        {
          required: false,
          type: 7,
          name: 'channel',
          channel_types: [ 15 ],
          description: 'Channel to make tasks forum'
        }
      ]
    },
    {
      type: 1,
      name: 'create',
      name_localizations: undefined,
      description: 'Creates a new task',
      description_localizations: undefined,
      options: []
    },
    {
      type: 1,
      name: 'edit',
      name_localizations: undefined,
      description: 'Edits an existing task',
      description_localizations: undefined,
      options: [
        {
          required: false,
          type: 3,
          name: 'id',
          description: 'The task id to edit'
        }
      ]
    }
  ],
  default_permission: undefined,
  default_member_permissions: undefined,
  dm_permission: undefined
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
        .addChannelOption(option =>
          option
            .setName('channel')
            .addChannelTypes(0) //TODO: Make it Channel.Type.forum whatever it is when they fix this
            .setRequired(false)
            .setDescription('Channel to make tasks forum')
        )        
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('config')
        .setDescription('Edit the tasks config for this server')
        .addChannelOption(option =>
          option
            .setName('channel')
            .addChannelTypes(0) //TODO: Make it Channel.Type.forum whatever it is when they fix this
            .setRequired(false)
            .setDescription('Channel to make tasks forum')
        )         
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
