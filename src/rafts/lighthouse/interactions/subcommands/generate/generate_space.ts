import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandOptions } from '../../../../../../lib/interfaces/Main.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class GenerateSpaceInteraction extends BaseInteraction {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'space',
      enabled: true,
    };
    super(raft, options);
  }

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const image = await this.raft.apis.nasa.getAPOD();

    let embed = new EmbedBuilder()
      .setTitle(image.title)
      .setURL('https://apod.nasa.gov/')
      .setColor('#0B3D91')
      .setDescription(image.explanation)
      .setImage(image.url)
      .addFields([{ name: 'Date', value: image.date }])
      .setTimestamp()
      .setFooter({ text: 'nasa.gov', iconURL: 'https://cdn.discordapp.com/app-assets/811111315988283413/811114038036529152.png' });
    return interaction.editReply({ embeds: [embed] });
  }
}

export default GenerateSpaceInteraction;
