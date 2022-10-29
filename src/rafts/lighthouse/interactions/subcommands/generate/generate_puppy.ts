import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { fileURLToPath } from 'url';
import { CommandOptions } from '../../../../../../lib/interfaces/Main.js';
import BaseInteraction from '../../../../BaseInteraction.js';

const __filename = fileURLToPath(import.meta.url);
const module = __filename;

class GeneratePuppyInteraction extends BaseInteraction {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'puppy',
      enabled: true,
    };
    super(raft, options);
  }

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const breed = interaction.options.getString('breed', false);
    const subbreed = interaction.options.getString('sub-breed', false)

    const pupper = await this.generate(breed, subbreed).catch(err => this.boat.log.verbose(module, `Error getting pupper`, err.response?.data));

    if (!pupper) {
      if (subbreed) {
        return interaction.editReply(`Subbreed \`${subbreed}\` or breed \`${breed}\` not found or the puppers went missing :(`);
      }
      if (breed) {
        return interaction.editReply(`Breed \`${breed}\` not found or the puppers went missing :(`);
      }
      return interaction.editReply('The puppers went missing :(');
    }

    const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('puppy', { breed, subbreed }) as ButtonBuilder;

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

    const embed = new EmbedBuilder()
      .setImage(pupper.message)
      .setColor('#0000FF')
      .setDescription(`It's a freaking pupper`)
      .setTimestamp(Date.now());

    interaction.editReply({ embeds: [embed], components: [row] });
  }

  async generate(breed?: string, subbreed?: string) {
    return await this.raft.apis.dog.getRandom(breed, subbreed);
  }
}

export default GeneratePuppyInteraction;
