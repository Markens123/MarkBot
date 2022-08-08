import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'ping',
  description: 'Calculates the bots ping',
};

class PingInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ping',
      guild: '826325501605969990',
      enabled: true,
      definition,
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - interaction.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new EmbedBuilder();
    embed.setTitle('Pong').setColor('#F1C40F').setDescription(description);

    await interaction.reply({embeds: [embed]});
    const response = await interaction.fetchReply();
    //@ts-ignore
    embed.setDescription(`${description} API latency ${response.createdTimestamp - interaction.createdTimestamp}ms.`);
    interaction.editReply({embeds: [embed]});
  }
}

export default PingInteraction;
