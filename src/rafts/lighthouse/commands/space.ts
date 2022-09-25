import { EmbedBuilder, Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class SpaceCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'space',
      owner: false,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Message) {
    const stars = await this.raft.apis.nasa.getAPOD();
    // Message.channel.send(`${stars.data.url}`)
    let embed = new EmbedBuilder()
      .setTitle(`${stars.title}`)
      .setURL('https://apod.nasa.gov/')
      .setColor('#0B3D91')
      .setDescription(`${stars.explanation}`)
      .setImage(`${stars.url}`)
      .addFields([{name: 'Date', value: `${stars.date}`}])
      .setTimestamp()
      .setFooter({text: 'nasa.gov', iconURL: 'https://cdn.discordapp.com/app-assets/811111315988283413/811114038036529152.png'});
    message.channel.send({embeds: [embed]});
  }
}

export default SpaceCommand;
