import { ActionRowBuilder, EmbedBuilder, Message, MessageActionRowComponentBuilder } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { AniQueue } from '../../../util/Constants.js';
import BaseCommand from '../../BaseCommand.js';

class AQueueCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'aqueue',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message) {
    const client = this.boat.client;
    const arr = client.maldata.get('queue');

    const embed = new EmbedBuilder().setTitle('Queue').setDescription(AniQueue(arr)).setColor('Random')

    const add = this.boat.interactions.buttonComponents.get('AQUEUE_ADD').definition();
    const reor = this.boat.interactions.buttonComponents.get('AQUEUE_REORDER').definition();
    const del = this.boat.interactions.buttonComponents.get('AQUEUE_DELETE').definition();

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(add, reor, del);

    return message.channel.send({ embeds: [embed], components: [row] });
  }
}

export default AQueueCommand;
