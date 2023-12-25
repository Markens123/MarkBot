import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class ConvertInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'convert',
      enabled: true,
      guild: '816098833054302208',
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    const platinum = interaction.options.getNumber('platinum', false) ?? 0;
    const gold = interaction.options.getNumber('gold', false) ?? 0;
    const silver = interaction.options.getNumber('silver', false) ?? 0;
    const electrum = interaction.options.getNumber('electrum', false) ?? 0;
    const copper = interaction.options.getNumber('copper', false) ?? 0;

    const final = (gold) + (silver * .1) + (platinum * 5) + (electrum * .05) + (copper * .01)
    const fields = [] as APIEmbedField[];

    for (const [key, value] of Object.entries({ platinum, gold, silver, electrum, copper })) {
      fields.push({ name: caps(key), value: value.toString(), inline: true })
    }

    const embed = new EmbedBuilder()
      .setTitle('Gold Conversion')
      .addFields(...fields, { name: 'Total', value: final.toString() })
      .setColor('Random')

    interaction.reply({ embeds: [embed] })
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('convert')
    .setDescription('Converts all money into gold')
    .addNumberOption(option =>
      option
        .setName('platinum')
        .setDescription('Platinum peices')
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName('gold')
        .setDescription('Gold peices')
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName('silver')
        .setDescription('Silver peices')
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName('electrum')
        .setDescription('Electrum peices')
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName('copper')
        .setDescription('Copper peices')
        .setRequired(false)
    )
    .toJSON()
}

function caps(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ConvertInteraction;
