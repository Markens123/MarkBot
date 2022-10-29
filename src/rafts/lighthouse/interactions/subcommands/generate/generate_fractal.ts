import pkg from 'canvas';
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { CommandOptions } from '../../../../../../lib/interfaces/Main.js';
import { util } from '../../../../../util/index.js';
const { createCanvas } = pkg;

class GenerateFractalInteraction extends BaseInteraction {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'fractal',
      enabled: true,
    };
    super(raft, options);
  }

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const startTime = Date.now();
    const color = interaction.options.getString('color', false);

    const buffer = await this.generate(color);

    const endTime = Date.now();
    const attachment = new AttachmentBuilder(buffer, { name: 'fractal.png' });

    const embed = new EmbedBuilder()
      .setTitle('Randomly generated fractal')
      .setImage('attachment://fractal.png')
      .setFooter({ text: `Generation time: ${(endTime - startTime) / 1000}s` })
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    const button = this.raft.interactions.buttonComponents.get('GENERATE_NEW').definition('fractal', { color }) as ButtonBuilder;

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

    interaction.editReply({ embeds: [embed], files: [attachment], components: [row] });
  }

  async generate(hcolor: string) {
    const width = 1200;
    const height = 1200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function checkIfBelongsToMandelbrotSet(x, y) {
      let realComponentOfResult = x;
      let imaginaryComponentOfResult = y;
      const maxIterations = 300;
      for (let i = 0; i < maxIterations; i++) {
        const tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;
        const tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult + y;
        realComponentOfResult = tempRealComponent;
        imaginaryComponentOfResult = tempImaginaryComponent;

        // Return a number as a percentage
        if (realComponentOfResult * imaginaryComponentOfResult > 5) {
          return (i / maxIterations) * 100;
        }
      }
      // Return zero if in set
      return 0;
    }

    const magnificationFactor = 2000;
    const panX = Math.random() * 2;
    const panY = Math.random() * 1;
    const color = hcolor ?? Math.floor(Math.random() * (360 - 1 + 1) + 1);
    for (let x = 0; x < canvas.width; x++) {
      await util.nonBlockLoop(
        canvas.height,
        (iteration, args) => {
          const belongsToSet = args.checkBelongs(args.x / args.magnificationFactor - args.panX, iteration / args.magnificationFactor - args.panY);
          if (belongsToSet === 0) {
            args.ctx.fillStyle = '#000';
            // Draw a black pixel
            args.ctx.fillRect(args.x, iteration, 1, 1);
          } else {
            args.ctx.fillStyle = `hsl(${color}, 100%, ${belongsToSet}%)`;
            // Draw a colorful pixel
            args.ctx.fillRect(args.x, iteration, 1, 1);
          }
        },
        { ctx, magnificationFactor, panX, panY, x, checkBelongs: checkIfBelongsToMandelbrotSet, color },
      );
    }
    ctx.translate(width / 2, height / 2);
    ctx.rotate((Math.floor(Math.random() * 360) * Math.PI) / 180);
    return canvas.toBuffer();
  }
}

export default GenerateFractalInteraction;
