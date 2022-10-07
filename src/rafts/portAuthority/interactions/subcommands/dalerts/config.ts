import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class DAlertsConfigInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'config',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const ptb = client.dalerts.get(interaction.guild.id, 'ptb');
    const canary = client.dalerts.get(interaction.guild.id, 'canary');
    const stable = client.dalerts.get(interaction.guild.id, 'stable');
    let text = '';

    text += canary ? `Canary - <#${canary}>` : '';
    text += ptb ? `PTB - <#${ptb}>` : '';
    text += stable ? `Stable - <#${stable}>` : '';
    if (!text) text = 'No alert channels set!';
    

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setDescription(text)

    interaction.reply({ embeds: [embed] })
  }
}

export default DAlertsConfigInteraction;
