import { AttachmentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';
import * as util from 'util';
import { ModalFunctions, ModalComponents } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class TestModalInteraction extends BaseInteraction {
  definition: () => ModalBuilder;
  
  constructor(raft) {
    const info = {
      name: 'TEST',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ModalSubmitInteraction) {
    const attachment = new AttachmentBuilder(Buffer.from(util.inspect(interaction.fields, { depth: 5}), 'utf-8'), {name: 'output.js'});

    interaction.reply({ files: [attachment] });
  }

  generateDefinition(): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(`${ModalFunctions[this.name]}:`).setTitle('Test Modal!');

    const nameInput = new TextInputBuilder()
    .setCustomId('name')
    .setLabel('Name')
    .setRequired(true)
    .setPlaceholder('Josh')
    .setStyle(TextInputStyle.Short);

    const ageInput = new TextInputBuilder()
    .setCustomId('age')
    .setLabel('Age')
    .setRequired(false)
    .setPlaceholder('21')
    .setStyle(TextInputStyle.Short);
    
    const hruInput = new TextInputBuilder()
    .setCustomId('hru')
    .setLabel('How are you doing today?')
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(...ModalComponents([nameInput, ageInput, hruInput]));

    return modal;
  }
}

export default TestModalInteraction;
