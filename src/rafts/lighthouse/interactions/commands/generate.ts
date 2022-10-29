import BaseInteraction from '../../../BaseInteraction.js';
import { SlashCommandBuilder } from 'discord.js';

class GenerateInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'generate',
      enabled: true,
      subcommands: true,
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run() {
    throw new Error('generate.ts was ran but should never be run')
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate images')
    .addSubcommand(subcommand =>
      subcommand
        .setName('stars')
        .setDescription('Generate image of stars')
        .addIntegerOption(option =>
          option
            .setName('stars')
            .setDescription('The number of stars to draw')
            .setMaxValue(300)
            .setMinValue(1)
            .setRequired(false)
        )
        .addIntegerOption(option =>
          option
            .setName('lines')
            .setDescription('The number of lines to draw')
            .setMaxValue(300)
            .setMinValue(1)            
            .setRequired(false)
        )
        .addBooleanOption(option =>
          option
            .setName('image')
            .setDescription('Should the image be posted without an embed')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('abstract')
        .setDescription('Generate abstract art')    
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('fractal')
        .setDescription('Generate fractal')
        .addStringOption(option =>
          option
            .setName('color')
            .setDescription('Color of the fractal')
            .addChoices(...[
              {
                name: 'Yellow',
                value: '60'
              },
              {
                name: 'Blue',
                value: '240'
              },
              {
                name: 'Pink',
                value: '300'
              },
              {
                name: 'Purple',
                value: '255'
              },
              {
                name: 'Cyan',
                value: '180'
              },
              {
                name: 'Red',
                value: '0'
              },
              {
                name: 'Green',
                value: '120'
              }
            ])
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('tree')
        .setDescription('Generate a tree')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('space')
        .setDescription('Gets daily image from nasa')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('puppy')
        .setDescription('Get an image of a puppy')
        .addStringOption(option =>
          option
            .setName('breed')
            .setDescription('Breed of the puppy you want')
            .setRequired(false)  
        )
        .addStringOption(option =>
          option
            .setName('sub-breed')
            .setDescription('Sub breed of the puppy you want')
            .setRequired(false)  
        )
    )
    .toJSON();
}

export default GenerateInteraction;