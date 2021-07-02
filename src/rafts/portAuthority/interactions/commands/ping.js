'use strict';

const { MessageEmbed } = require('discord.js');
const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'ping',
  description: 'Calculates the bots ping',
};

class PingInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'ping',
      guild: '826325501605969990',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,
      definition,
    };
    super(raft, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - interaction.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new MessageEmbed();
    embed.setTitle('Pong').setColor('#F1C40F').setDescription(description);

    await interaction.reply(embed);
    const response = await interaction.fetchReply();
    embed.setDescription(`${description} API latency ${response.createdTimestamp - interaction.createdTimestamp}ms.`);
    interaction.editReply(embed);
  }
}

module.exports = PingInteraction;
