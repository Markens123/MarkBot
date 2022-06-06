import { ModalSubmitInteraction } from 'discord.js';
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
    interaction.reply(`\`\`\`js\n${util.inspect(interaction.fields)}\`\`\``);
    }

  }


export default TestInteraction;
