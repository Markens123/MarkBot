import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class GenerateNewInteraction extends BaseInteraction {
  definition: () => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'GENERATE_NEW',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const boat = this.boat;
    const startTime = Date.now();
    const type = interaction.customId.split(':')[1];
    const data = interaction.customId.split(':')[2];
    const parsed_data = JSON.parse(`{${data.slice(0, -1).replaceAll('=', ':')}}`);
    let command = boat.interactions.subcommands.get('generate').get(type);

    await interaction.deferReply()

    if (type === 'fractal') {
      //@ts-expect-error
      const buffer = await command.generate(parsed_data.color);

      const endTime = Date.now();
      const attachment = new AttachmentBuilder(buffer, { name: 'fractal.png' });

      const embed = new EmbedBuilder()
        .setTitle('Randomly generated fractal')
        .setImage('attachment://fractal.png')
        .setFooter({ text: `Generation time: ${(endTime - startTime) / 1000}s` })
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

      const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('fractal', parsed_data) as ButtonBuilder;

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

      return interaction.editReply({ embeds: [embed], files: [attachment], components: [row] });
    } else if (type === 'abstract') {
      //@ts-expect-error
      const buffer = await command.generate();

      const attachment = new AttachmentBuilder(buffer, { name: 'image.png' });

      const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('abstract') as ButtonBuilder;

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

      return interaction.editReply({ files: [attachment], components: [row] })
    } else if (type === 'puppy') {
      const { breed, subbreed } = parsed_data;
      //@ts-expect-error
      const pupper = await command.generate(breed, subbreed);

      if (!pupper) {
        if (subbreed) {
          return interaction.editReply(`Subbreed \`${subbreed}\` or breed \`${breed}\` not found or the puppers went missing :(`);
        }
        if (breed) {
          return interaction.editReply(`Breed \`${breed}\` not found or the puppers went missing :(`);
        }
        return interaction.editReply('The puppers went missing :(');
      }

      const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('puppy', parsed_data) as ButtonBuilder;

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

      const embed = new EmbedBuilder()
        .setImage(pupper.message)
        .setColor('#0000FF')
        .setDescription(`It's a freaking pupper`)
        .setTimestamp(Date.now());

      return interaction.editReply({ embeds: [embed], components: [row] });
    } else if (type === 'stars') {
      const { stars, lines, image } = parsed_data;
      //@ts-expect-error
      const buffer = await command.generate(stars, lines);

      const attachment = new AttachmentBuilder(buffer, { name: 'image.png' });

      let embed = new EmbedBuilder()
        .setTitle('Random Stars')
        .setColor('#000001')
        .setImage('attachment://image.png')
        .setFooter({ text: `Stars: ${stars} | Lines: ${lines}` })
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

      const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('stars', parsed_data) as ButtonBuilder;

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

      return interaction.editReply({ embeds: image ? null : [embed], files: [attachment], components: [row] });
    } else if (type === 'tree') {
      //@ts-expect-error
      const buffer = await command.generate();
      const endTime = Date.now();

      const attachment = new AttachmentBuilder(buffer, { name: 'tree.png' });

      const embed = new EmbedBuilder()
        .setTitle('Randomly generated tree')
        .setImage('attachment://tree.png')
        .setFooter({ text: `Generation time: ${(endTime - startTime) / 1000}s` })
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

      const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('tree') as ButtonBuilder;

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

      return interaction.editReply({ embeds: [embed], files: [attachment], components: [row] });
    }
  }

  generateDefinition(type: string, data: any = {}): ButtonBuilder {
    let filtered = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null)) as { color?: string };

    const final = Object.entries(filtered).reduce(
      (previousValue, [key, value]) => {
        return `${previousValue}"${key}"=${JSON.stringify(value)},`
      },
      ''
    );

    const customId = `${ComponentFunctions[this.name]}:${type}:${final}`;
    return new ButtonBuilder({
      customId,
      label: 'Again',
      style: ButtonStyle.Primary,
    })
  }
}

export default GenerateNewInteraction;
