import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { InteractionYesNo } from '../../../../util/Buttons.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class HAlertsResetInteraction extends BaseInteraction {
  definition: () => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'HALERTS_RESET',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const client = this.boat.client;
    await interaction.deferReply();

    if (!client.halerts.get(interaction.guild.id)) return interaction.editReply('This guild does not have a config set. Please use /halerts to configure it.')

    const resp = await InteractionYesNo({
      interaction,
      content: 'Are you sure that you want to reset the halert config for this server?',
      editReply: true
    });

    if (resp) {
      client.halerts.delete(interaction.guild.id)
      interaction.editReply({ content: 'The config has been reset please use /halerts to reconfigure it.', components: [] })
    } else {
      interaction.editReply({ content: 'Opertation canceled', components: [] })
    }

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new ButtonBuilder({
      customId,
      label: '🗑️',
      style: ButtonStyle.Danger,
    })  
  } 
}

export default HAlertsResetInteraction;
