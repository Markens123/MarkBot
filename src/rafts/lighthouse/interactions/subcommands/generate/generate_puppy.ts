import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
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

    const pupper = await this.raft.apis.dog.getRandom(breed, subbreed).catch(err => this.boat.log.verbose(module, `Error getting pupper`, err.response?.data));

    if (!pupper) {
      if (subbreed) {
        interaction.editReply(`Subbreed \`${subbreed}\` or breed \`${breed}\` not found or the puppers went missing :(`);
        return;
      }
      if (breed) {
        interaction.editReply(`Breed \`${breed}\` not found or the puppers went missing :(`);
        return;
      }
      interaction.editReply('The puppers went missing :(');
      return;
    }

    const embed = new EmbedBuilder().setImage(pupper.message).setColor('#0000FF');
    embed.setDescription(`It's a freaking pupper`).setTimestamp(Date.now());
    interaction.editReply({ embeds: [embed] });
  }
}

export default GeneratePuppyInteraction;
