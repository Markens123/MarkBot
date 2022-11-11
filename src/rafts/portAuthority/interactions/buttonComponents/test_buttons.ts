import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';
const delay = s => new Promise(res => setTimeout(res, s * 1000));

class TestButtonsInteraction extends BaseInteraction {
  definition: () => ActionRowBuilder<MessageActionRowComponentBuilder>[];
  name: string;

  constructor(raft) {
    const info = {
      name: 'TEST_BUTTONS',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition;
  }

  async run(interaction: ButtonInteraction) {
    const id = interaction.customId.split(':').slice(1);
    const chars = id.join().split('');
    const ephemeral = chars[2] === 'e' ? true : false;
    const num = this.delays[chars[0]];


    switch (id[0]) {
      case 'modal':
        const modal = this.boat.interactions.modals.get('TEST').definition();
        return interaction.showModal(modal);
      case 'noresp':
        return interaction.deferUpdate();
      case 'fail':
        return;
    }

    switch (chars[1]) {
      case 'r':
        return interaction.reply({ content: `Replied ${ephemeral ? 'ephemeral' : ''}`, ephemeral });
      case 'd':
        await interaction.deferReply({ ephemeral });
        await delay(num);
        return interaction.editReply({ content: `Defer Reply ${ephemeral ? 'ephemeral' : ''}` });
      case 'u':
        await interaction.deferUpdate();
        await delay(num);
        return interaction.message.reply({ content: `Defer Update` }).catch(() => { });
      case 'e':
        await interaction.reply({ content: 'Waiting for edit', ephemeral });
        await delay(num);
        return interaction.editReply({ content: `Edit ${ephemeral ? 'ephemeral' : ''}` }).catch(() => { });
      default:
        return interaction.reply({ content: 'Idk what to do', ephemeral: true });
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

    const fu = new ButtonBuilder({
      customId: `${customId}:fu`,
      label: 'Update (5s)',
      style: ButtonStyle.Success
    });

    const modal = new ButtonBuilder({
      customId: `${customId}:modal`,
      label: 'Modal',
      style: ButtonStyle.Success
    });

    const noresp = new ButtonBuilder({
      customId: `${customId}:noresp`,
      label: 'No Response',
      style: ButtonStyle.Success
    });

    const fail = new ButtonBuilder({
      customId: `${customId}:fail`,
      label: 'Fail',
      style: ButtonStyle.Success
    });

    const row4 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(fu, modal, fail, noresp);

    return [row1, row2, row3, row4];
  }

  delays = {
    'z': 0,
    't': 3,
    'f': 5,
    'g': 15
  }
}

export default TestButtonsInteraction;
