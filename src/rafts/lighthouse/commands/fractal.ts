import pkg from 'canvas';
const { createCanvas } = pkg;

import Discord from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { util } from '../../../util/index.js';

import BaseCommand from '../../BaseCommand.js';

class FractalCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'fractal',
      owner: false,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Discord.Message) {
    const responseMsg = await message.channel.send('Generating Fractal');
    const startTime = Date.now();
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
    for (let x = 0; x < canvas.width; x++) {
      /* eslint-disable no-await-in-loop */
      await util.nonBlockLoop(
        canvas.height,
        (iteration, args) => {
          const belongsToSet = args.checkBelongs(args.x / args.magnificationFactor - args.panX, iteration / args.magnificationFactor - args.panY);
          if (belongsToSet === 0) {
            args.ctx.fillStyle = '#000';
            // Draw a black pixel
            args.ctx.fillRect(args.x, iteration, 1, 1);
          } else {
            args.ctx.fillStyle = `hsl(165, 100%, ${belongsToSet}%)`;
            // Draw a colorful pixel
            args.ctx.fillRect(args.x, iteration, 1, 1);
          }
        },
        { ctx, magnificationFactor, panX, panY, x, checkBelongs: checkIfBelongsToMandelbrotSet },
      );
    }
    ctx.translate(width / 2, height / 2);
    ctx.rotate((Math.floor(Math.random() * 360) * Math.PI) / 180);
    const endTime = Date.now();
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fractal.png');

    const embed = new Discord.MessageEmbed()
      .setTitle('Randomly generated fractal')
      .setImage('attachment://fractal.png')
      .setFooter(`Generation time: ${(endTime - startTime) / 1000}s`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL());

    if (responseMsg.deletable) responseMsg.delete();
    message.channel.send({embeds: [embed], files: [attachment]});
  }
}

export default FractalCommand;
