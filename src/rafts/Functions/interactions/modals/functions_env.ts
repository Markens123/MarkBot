import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ModalComponents, ModalFunctions } from '../../../../util/Constants.js';

class FunctionsEnvModalInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'FUNCTIONS_ENV',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const client = this.boat.client;
    const name = interaction.customId.split(':')[1];
    const vars = interaction.customId.split(':')[2].split(',');
    console.log({name, vars})
    console.log(interaction.fields)
  }

  generateDefinition(name: string, vars: string[]): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(`${ModalFunctions[this.name]}:${name}:${vars.join(',')}`)
      .setTitle('Env vars');

    for (let i = 0; i < vars.length; i++) {
      let input = new TextInputBuilder()
      .setCustomId(i.toString())
      .setLabel(vars[i])
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

      modal.addComponents(...ModalComponents([input]));  
    }

      return modal;
  }
}

export default FunctionsEnvModalInteraction;
