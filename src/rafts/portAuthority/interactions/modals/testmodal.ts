import { MessageAttachment, ModalSubmitInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import * as util from 'util';

class TestInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'TEST',
      enabled: true,
    };
    super(raft, info);
  }

  async run(interaction: ModalSubmitInteraction) {
    const attachment = new MessageAttachment(Buffer.from(util.inspect(interaction.fields, { depth: 5}), 'utf-8'), 'eval.js');

    interaction.reply({ files: [attachment] });
    }

  }


export default TestInteraction;
