import { EmbedBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class EchoCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'echo',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message, args: any) {
    let embed = new EmbedBuilder()
      .setTitle('Echo')
      .setColor('Random')
      .setDescription(args.join(' '))
      .setFooter({text: 'Made by Pilottoaster, Ethan, Markens123 without ck'})
      .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()});

    message.channel.send({embeds: [embed]});
  }
}

export default EchoCommand;
