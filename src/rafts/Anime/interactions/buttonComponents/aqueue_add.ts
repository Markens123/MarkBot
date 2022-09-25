import { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Message } from 'discord.js';
import { AniQueue, ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class AQueueAddInteraction extends BaseInteraction {
  definition: () => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'AQUEUE_ADD',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const client = this.boat.client;
    
    interaction.reply({ content: 'Please send an anime title to add to the queue.' })

    const filter = (msg: Message) => msg.author.id === interaction.user.id;

    const options = {
      filter,
      idle: 15000,
      max: 1,
    }

    const resp = await interaction.channel.awaitMessages(options);

    if (!resp.size) return interaction.deleteReply();

    const message = resp.first();

    let arr = client.maldata.push('queue', message.content).get('queue') as string[];


    message.delete().catch(() => {})

    const embed = new EmbedBuilder().setTitle('Queue').setDescription(AniQueue(arr)).setColor('Random')

    interaction.channel.messages.cache.get(interaction.message.id).edit({ embeds: [embed] }).catch(() => {});
    
    interaction.deleteReply()

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new ButtonBuilder({
      customId,
      label: '➕',
      style: ButtonStyle.Primary,
    })  
  } 
}

export default AQueueAddInteraction;
