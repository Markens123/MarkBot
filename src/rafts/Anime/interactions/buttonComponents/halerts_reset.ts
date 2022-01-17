import { ButtonInteraction, MessageButton } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import { YesNo } from '../../../../util/Buttons.js';

class HAlertsResetInteraction extends BaseInteraction {
  definition: () => MessageButton;
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

    const resp = await YesNo(interaction.channel.messages.cache.get(interaction.message.id), 'Would you like to reset the halert config for this server?', interaction.user);

    if (resp) {
      client.halerts.delete(interaction.guild.id)
      interaction.editReply('The config has been reset please use /halerts to reconfigure it.')
    } else {
      interaction.editReply('Opertation canceled')
    }

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new MessageButton({
      customId,
      label: '🗑️',
      style: 'DANGER',
    })  
  } 
}

export default HAlertsResetInteraction;
