import { ChatInputCommandInteraction } from 'discord.js';
import { InteractionYesNo } from '../../../../../util/Buttons.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class UnlinkInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'unlink',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;

    await interaction.reply({ content: '‎', ephemeral: true })

    if (!client.maldata.get(interaction.user.id)) return interaction.editReply({ content: "Error you don't have an account to unlink."});

    const resp = await InteractionYesNo({ content: 'Are you sure that you want to unlink your account?', interaction, editReply: true})

    if (!resp) return interaction.editReply({ content: 'Unlink operation canceled.', components: [] })
    else {
      client.maldata.delete(interaction.user.id);
      interaction.editReply({ content: "Success, your account has been unlinked.", components: [] });
    }
  }
}


export default UnlinkInteraction;
