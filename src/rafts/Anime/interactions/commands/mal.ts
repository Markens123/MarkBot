import BaseInteraction from '../../../BaseInteraction.js';
import { SlashCommandBuilder } from 'discord.js';

class MALInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'mal',
      enabled: true,
      subcommands: true,
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run() {
    throw new Error('mal.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('mal')
    .setDescription('My Anime List commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('mylist')
        .setDescription('Gets your list with the filters')
        .addStringOption(option =>
          option
            .setName('sort')
            .setDescription('Option to sort list by')
            .addChoices(...[
              {
                name: 'List Score',
                value: 'list_score'
              },
              {
                name: 'List Updated',
                value: 'list_updated_at'
              },
              {
                name: 'Title',
                value: 'anime_title'
              },
              {
                name: 'Start Date',
                value: 'anime_start_date'
              }
            ])
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('status')
            .setDescription('Option to only include anime with the selected status')
            .addChoices(...[
              {
                name: 'Watching',
                value: 'watching'
              },
              {
                name: 'Completed',
                value: 'completed'
              },
              {
                name: 'On Hold',
                value: 'on_hold'
              },
              {
                name: 'Plan To Watch',
                value: 'plan_to_watch'
              },
              {
                name: 'Dropped',
                value: 'dropped'
              }
            ])
            .setRequired(false)
        )
        .addIntegerOption(option => 
          option
            .setName('page')
            .setDescription('Page to start on')
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Get an anime by mal id')
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('Id of anime to get')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('search')
        .setDescription('Search for anime by title')
        .addStringOption(option =>
          option
            .setName('query')
            .setDescription('What to search for')
            .setMinLength(3)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('link')
        .setDescription('Link your mal account')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('unlink')
        .setDescription('Unlink your mal account')
    )    
    .toJSON();
}

export default MALInteraction;
