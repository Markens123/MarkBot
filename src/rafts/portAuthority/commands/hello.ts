import { EmbedBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class HelloCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'hello',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message) {
    let embed = new EmbedBuilder()
      .setTitle('Hello there')
      .setColor('#FF0000')
      .setDescription('Beep beep')
      .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
      .setImage('https://i.imgur.com/SQUhP5T.gif');
          
    message.channel.send({embeds: [embed]});
  }
}

export default HelloCommand;
