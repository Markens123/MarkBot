import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageActionRowComponentBuilder, Snowflake } from 'discord.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';
const delay = s => new Promise(res => setTimeout(res, s*1000));

class TestButtonsInteraction extends BaseInteraction {

  definition: (user: Snowflake) => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'TEST_BUTTONS',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const chars = interaction.customId.split(':').slice(1).join().split('');
    const ephemeral = chars[2] === 'e' ? true : false;
    const num = this.delays[chars[0]];

    if (chars[1] === 'r') {
      return interaction.reply({ content: `Replied ${ephemeral ? 'ephemeral' : ''}`, ephemeral })
    } else if (chars[1] === 'd') {
      await interaction.deferReply({ ephemeral });
      await delay(num);
      return interaction.editReply({ content: `Defer Reply ${ephemeral ? 'ephemeral' : ''}`})
    } else if (chars[1] === 'd') {
      await interaction.deferUpdate();
      await delay(num);
      return interaction.message.reply({ content: `Defer Update`}).catch(() => {});
    } else if (chars[1] === 'e') {
      await interaction.reply({ content: 'Waiting for edit',ephemeral });
      await delay(num);
      return interaction.editReply({ content: `Edit ${ephemeral ? 'ephemeral' : ''}`}).catch(() => {});
    }
  }

  generateDefinition(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
    const customId = `${ComponentFunctions[this.name]}`;

    /*
      Key for buttons
      {delay}{resp}{e?(ephemeral)}

      delays:
        z = 0
        t = 3
        f = 5
        g = 15
      resp:
        d = deferReply
        r = reply (can only be for 0s)
        u = deferUpdate
        e = Edit after delay
      Ex. fee = Ephemeral button that edits after five seconds
    */

    const zr = new ButtonBuilder({
      customId: `${customId}:zr`,
      label: 'Reply (0s)',
      style: ButtonStyle.Primary
    });
    const td = new ButtonBuilder({
      customId: `${customId}:td`,
      label: 'Reply (3s)',
      style: ButtonStyle.Primary
    });
    const fd = new ButtonBuilder({
      customId: `${customId}:fd`,
      label: 'Reply (5s)',
      style: ButtonStyle.Primary
    });
    const gd = new ButtonBuilder({
      customId: `${customId}:gd`,
      label: 'Reply (15s)',
      style: ButtonStyle.Primary
    });

    const row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(zr, td, fd, gd);

    const zre = new ButtonBuilder({
      customId: `${customId}:zre`,
      label: 'Reply (0s) (Ephemeral)',
      style: ButtonStyle.Secondary
    });
    const tde = new ButtonBuilder({
      customId: `${customId}:tde`,
      label: 'Reply (3s) (Ephemeral)',
      style: ButtonStyle.Secondary
    });
    const gde = new ButtonBuilder({
      customId: `${customId}:gde`,
      label: 'Reply (15s) (Ephemeral)',
      style: ButtonStyle.Secondary
    });

    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(zre, tde, gde);

    const zee = new ButtonBuilder({
      customId: `${customId}:zee`,
      label: 'Edit (0s) (Ephemeral)',
      style: ButtonStyle.Danger
    });
    const tee = new ButtonBuilder({
      customId: `${customId}:tee`,
      label: 'Edit (3s) (Ephemeral)',
      style: ButtonStyle.Danger
    });
    const gee = new ButtonBuilder({
      customId: `${customId}:gee`,
      label: 'Edit (15s) (Ephemeral)',
      style: ButtonStyle.Danger
    });

    const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(zee, tee, gee);

    return [row1, row2, row3];
  }

  delays = {
    'z': 0,
    't': 3,
    'f': 5,
    'g': 15
  }
}

export default TestButtonsInteraction;
