import { randomUUID } from 'crypto';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class MALlinkInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'link',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    let state = '';

    if (client.maldata.has('states', interaction.user.id)) state = client.maldata.get('states', interaction.user.id);
    else {
      state = randomUUID().replaceAll('-', '').slice(0, 10);
      client.maldata.set('states', state, interaction.user.id);
    }

    const embed = new EmbedBuilder()
      .setDescription(`Click on [this](${process.env.MAL_AUTH_LINK}&state=${state}) to link your account!`)
      .setColor('Random');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}


export default MALlinkInteraction;
