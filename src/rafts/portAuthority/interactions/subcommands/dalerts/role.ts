import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class DAlertsRoleInteraction extends BaseInteraction {
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
    const role = interaction.options.getRole('role', false);
    const remove = interaction.options.getBoolean('remove', false);
    client.dalerts.ensure(interaction.guild.id, {});

    if (!remove && !role) {
      return interaction.reply({ content: 'You must select the role or remove option!', ephemeral: true })
    }

    if (remove) {
      client.dalerts.delete(interaction.guild.id, `${branch}.mention`)
      return interaction.reply(`Mention for '${branch}' has been removed!`)
    }

    if (!client.dalerts.get(interaction.guild.id, `${branch}.channel`)) {
      return interaction.reply({ content: 'Alerts for that branch has not been setup yet!', ephemeral: true })
    }

    client.dalerts.set(interaction.guild.id, role.id, `${branch}.mention`);

    return interaction.reply({ content: `You set the mention for '${branch}' to ${role.toString()}`, allowedMentions: {} })
  }
}

export default DAlertsRoleInteraction;
