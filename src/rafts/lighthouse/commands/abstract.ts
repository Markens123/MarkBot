import pkg from 'canvas';
const { createCanvas } = pkg;
import { AttachmentBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { util } from '../../../util/index.js';
import BaseCommand from '../../BaseCommand.js';

class AbstractCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'abstract',
      owner: true,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Message) {
    const width = 1200;
    const height = 730;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#57C7FF';
    context.fillRect(0, 0, width, height);
    const maxIterations = 20;
    await util.nonBlockLoop(
      maxIterations,
      (i, args) => {
        args.context.fillStyle = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
        args.context.arc(Math.random() * 1150 + 1, Math.random() * 720 + 1, 1, 0, 2 * Math.PI);
        args.context.fill();
      },
      { context },
    );

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'blue.png'});

    message.channel.send({files: [attachment]});
  }
}

export default AbstractCommand;
