'use strict';

import pkg from 'canvas';
const { createCanvas } = pkg;

import Discord from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

import BaseCommand from '../../BaseCommand.js';

class StarsCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'stars',
      owner: false,
      enabled: true,
      args: [
        {
          name: 'stars',
          type: 'int',
        },
        {
          name: 'lines',
          type: 'int',
        },
        {
          name: 'image',
          type: 'flag',
          index: 0,
          flags: ['--image', '-i'],
          default: false,
        },
      ],
    };
    super(raft, options);
  }

  run(message: Discord.Message, args: any) {
    console.log(args)
    const width = 1200;
    const height = 730;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    const stars = args.stars ?? Math.floor(Math.random() * 101) + 75;
    const lines = args.lines ?? Math.floor(Math.random() * 4) + 3;
    let a = [];

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineJoin = 'miter';
    context.lineWidth = 5;

    for (let i = 0; i <= stars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      a.push({ x, y });
      const size = (Math.floor(Math.random() * 20) + 10) / 10;
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
      if (i > 0 && i <= lines) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(a[i - 1].x, a[i - 1].y);
        context.stroke();
        context.closePath();
      }
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');

    let embed = new Discord.MessageEmbed()
      .setTitle('Random Stars')
      .setColor('#000001')
      .setImage('attachment://image.png')
      .setFooter(`Dots: ${stars} | Lines: ${lines}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL());

    message.channel.send({embeds: args.image ? null : [embed], files: [attachment]});
  }
}

export default StarsCommand;
