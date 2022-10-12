import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class DAlertsSetInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'set',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const branch = interaction.options.getString('branch');
    const channel = interaction.options.getChannel('channel', false);
    const remove = interaction.options.getBoolean('remove', false);
    client.dalerts.ensure(interaction.guild.id, {});

    if (!remove && !channel) {
      return interaction.reply({ content: 'You must select a channel or the remove option!', ephemeral: true })
    }

    if (remove) {
      client.dalerts.delete(interaction.guild.id, branch)
      return interaction.reply(`Updates for '${branch}' will no longer be recieved!`)
    }

    client.dalerts.set(interaction.guild.id, channel.id, `${branch}.channel`);

    return interaction.reply(`You set the updates channel for '${branch}' to ${channel.toString()}`)
  }
}

export default DAlertsSetInteraction;
