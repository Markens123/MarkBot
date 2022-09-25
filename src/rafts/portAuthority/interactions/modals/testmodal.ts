import { AttachmentBuilder, ModalSubmitInteraction } from 'discord.js';
import * as util from 'util';
import BaseInteraction from '../../../BaseInteraction.js';

class TestInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TEST',
      enabled: true,
    };
    super(raft, info);
  }

  async run(interaction: ModalSubmitInteraction) {
    const attachment = new AttachmentBuilder(Buffer.from(util.inspect(interaction.fields, { depth: 5}), 'utf-8'), {name: 'output.js'});

    interaction.reply({ files: [attachment] });
  }
}

export default TestInteraction;
