'use strict';

const { MessageEmbed, APIMessage, SnowflakeUtil } = require('discord.js');
const BaseInteraction = require('../../../BaseInteraction');

const definition = {
  name: 'ping',
  description: 'Calculates the bots ping',
};

class PingInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'ping',
      guild: '826325501605969990',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    const description = `🏓 API offset: ${Date.now() - interaction.createdTimestamp}ms. Heartbeat: ${Math.round(client.ws.ping)}ms.`;
    let embed = new MessageEmbed();
    embed.setTitle('Pong').setColor('#F1C40F').setDescription(description);

    interaction.reply(embed);
    await new Promise(resolve => setTimeout(resolve, 200));
    const response = await this.boat.client.api.webhooks(this.boat.client.user.id, interaction.token).messages('@original').patch({ data: {} });
    embed.setDescription(`${description} API latency ${SnowflakeUtil.deconstruct(response.id).timestamp - interaction.createdTimestamp}ms.`);
    const apiMessage = APIMessage.create(interaction.webhook, embed).resolveData();
    this.boat.client.api.webhooks(this.boat.client.user.id, interaction.token).messages('@original').patch({ data: apiMessage.data });
  }
}

module.exports = PingInteraction;
