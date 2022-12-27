import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class AAlertsSetupInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'setup',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const channel = await client.channels.fetch(interaction.options.getChannel('channel', true).id);

    if (!interaction.guild.members.me.permissionsIn(channel.id).has('SendMessages')) {
      return interaction.reply({ content: `I don't have permission to send messages in ${channel.toString()}`, ephemeral: true });
    }

    client.animealerts.set(
      interaction.guild.id,
      {
        animes: [],
        mentions: {},
        channel: channel.id
      }
    )

    return interaction.reply({ content: `Setup complete. Alerts channel has been set to ${channel.toString()}`, ephemeral: true });
  }
}

export default AAlertsSetupInteraction;
