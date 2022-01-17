import { ButtonInteraction, MessageButton, Message, MessageEmbed } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { AniQueue, ComponentFunctions } from '../../../../util/Constants.js';

class AQueueDeleteInteraction extends BaseInteraction {
  definition: () => MessageButton;
  name: string;

  constructor(raft) {
    const info = {
      name: 'AQUEUE_DELETE',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const client = this.boat.client;
    let arr = client.maldata.get('queue');
    interaction.reply({ content: 'Please send the index of the anime to delete.' });

    const filter = (msg: Message) => msg.author.id === interaction.user.id;

    const options = {
      filter,
      idle: 15000,
      max: 1,
    }

    const resp = await interaction.channel.awaitMessages(options);

    if (!resp.size) return interaction.deleteReply();

    const message = resp.first();
  
    const index = parseInt(message.content);

    if (index === NaN || !arr[index] || index < 0) {
      message.delete()
      return interaction.editReply('Please provide a valid index!')
    }


    arr.splice(index, 1);

    client.maldata.set('queue', arr)

    const embed = new MessageEmbed().setTitle('Queue').setDescription(AniQueue(arr)).setColor('RANDOM')

    interaction.channel.messages.cache.get(interaction.message.id).edit({ embeds: [embed] }).catch(() => {});
    
    interaction.deleteReply();
    message.delete().catch(() => {});

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new MessageButton({
      customId,
      label: '🗑️',
      style: 'DANGER',
    })  
  } 
}

export default AQueueDeleteInteraction;
