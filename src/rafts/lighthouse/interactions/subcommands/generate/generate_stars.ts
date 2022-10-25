import pkg from 'canvas';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { CommandOptions } from '../../../../../../lib/interfaces/Main.js';
const { createCanvas } = pkg;

class GenerateStarsInteraction extends BaseInteraction {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'stars',
      enabled: true,
    };
    super(raft, options);
  }

  run(interaction: ChatInputCommandInteraction) {
    const width = 1200;
    const height = 730;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    const stars = interaction.options.getInteger('stars', false) || Math.floor(Math.random() * 101) + 75;
    const lines = interaction.options.getInteger('lines', false) || Math.floor(Math.random() * 4) + 3;
    const image = interaction.options.getBoolean('image', false);
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
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });

    let embed = new EmbedBuilder()
      .setTitle('Random Stars')
      .setColor('#000001')
      .setImage('attachment://image.png')
      .setFooter({ text: `Stars: ${stars} | Lines: ${lines}` })
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    interaction.reply({ embeds: image ? null : [embed], files: [attachment] });
  }
}

export default GenerateStarsInteraction;
