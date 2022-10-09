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
    client.dalerts.ensure(interaction.guild.id, {})
    const ptb = client.dalerts.get(interaction.guild.id, 'ptb');
    const canary = client.dalerts.get(interaction.guild.id, 'canary');
    const stable = client.dalerts.get(interaction.guild.id, 'stable');

    const canarytext = canary?.channel ? 
      `Channel - <#${canary.channel}>${canary.mention ? `\nMention - <@&${canary.mention}>` : ''}` 
    : 'None';
    const ptbtext = ptb?.channel ? 
      `Channel - <#${ptb.channel}>${ptb.mention ? `\nMention - <@&${ptb.mention}>` : ''}` 
    : 'None';
    const stabletext = stable?.channel ? 
      `Channel - <#${stable.channel}>${stable.mention ? `\nMention - <@&${stable.mention}>` : ''}` 
    : 'None'; 

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Discord Alerts Config')
      .addFields([
        {
          name: 'Canary',
          value: canarytext
        },
        {
          name: 'PTB',
          value: ptbtext
        },
        {
          name: 'Stable',
          value: stabletext
        },
      ])

    interaction.reply({ embeds: [embed] })
  }
}

export default DAlertsConfigInteraction;
