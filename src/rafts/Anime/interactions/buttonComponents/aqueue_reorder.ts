import { ButtonInteraction, MessageButton, Message, MessageEmbed, Snowflake, SnowflakeUtil, MessageSelectMenu, MessageActionRow, SelectMenuInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { AniQueue, ComponentFunctions } from '../../../../util/Constants.js';

class AQueueReorderInteraction extends BaseInteraction {
  definition: () => MessageButton;
  name: string;

  constructor(raft) {
    const info = {
      name: 'AQUEUE_REORDER',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const client = this.boat.client;
    const code = SnowflakeUtil.generate();
    let arr = client.maldata.get('queue');

    const embed = new MessageEmbed().setTitle('Preview').setDescription('Please add stuff using the select menu!').setColor('NOT_QUITE_BLACK')

    let options = [];

    for (let i = 0; i < arr.length; i++) {
      options.push({
        label: arr[i],
        value: i.toString()
      })
    }

    const select = new MessageSelectMenu().addOptions(options).setCustomId(`collector:aqueue_select:${code}`);
    const done = new MessageButton().setLabel('Done').setStyle('SUCCESS').setCustomId(`collector:aqueue_done:${code}`);
    const reset = new MessageButton().setLabel('Reset').setStyle('DANGER').setCustomId(`collector:aqueue_reset:${code}`);
    const row = new MessageActionRow().addComponents(select);
    const row2 = new MessageActionRow().addComponents(done, reset);



    interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true });

    const filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code;

    const o = {
      filter,
      idle: 15000
    }


    const collector = interaction.channel.createMessageComponentCollector(o);

    let newarr = []

    collector.on('collect', async (int: ButtonInteraction | SelectMenuInteraction) => {

      if (!int.customId.split(':')[1].startsWith('aqueue')) return int.reply({ content: "These are not the droids you're looking for", ephemeral: true });

      int.deferUpdate()

      if (int instanceof SelectMenuInteraction) {
        let index = int.values[0]
        newarr.push(arr[index])
        arr.splice(index, 1)

        const embed = new MessageEmbed().setTitle('Preview').setDescription(AniQueue(newarr)).setColor('NOT_QUITE_BLACK')

        let oarr = [];
    
        for (let i = 0; i < arr.length; i++) {
          oarr.push({
            label: arr[i],
            value: i.toString()
          })
        }
    
        const select = new MessageSelectMenu().addOptions(oarr).setCustomId(`collector:aqueue_select:${code}`);
        const done = new MessageButton().setLabel('Done').setStyle('SUCCESS').setCustomId(`collector:aqueue_done:${code}`);
        const reset = new MessageButton().setLabel('Reset').setStyle('DANGER').setCustomId(`collector:aqueue_reset:${code}`);
        
        if (!arr.length) {
          select.addOptions({value: 'None', label: 'None'});
          select.setDisabled(true);
        }

        const row = new MessageActionRow().addComponents(select);
        const row2 = new MessageActionRow().addComponents(done, reset);

        interaction.editReply({ embeds: [embed], components: [row, row2] })

      } else {
        if (int.customId.split(':')[1] === 'aqueue_done') {
          client.maldata.set('queue', newarr)

          const embed = new MessageEmbed().setTitle('Queue').setDescription(AniQueue(newarr)).setColor('RANDOM')

          interaction.channel.messages.cache.get(interaction.message.id).edit({ embeds: [embed] }).catch(() => {});

          const select = new MessageSelectMenu().setCustomId(`collector:aqueue_select:${code}`).addOptions({value: 'None', label: 'None'}).setDisabled(true);
          const done = new MessageButton().setLabel('Done').setStyle('SUCCESS').setCustomId(`collector:aqueue_done:${code}`).setDisabled(true);
          const reset = new MessageButton().setLabel('Reset').setStyle('DANGER').setCustomId(`collector:aqueue_reset:${code}`);
          
          const row = new MessageActionRow().addComponents(select);
          const row2 = new MessageActionRow().addComponents(done, reset);
  
          interaction.editReply({ embeds: [embed], components: [row, row2] })


        } else if (int.customId.split(':')[1] === 'aqueue_reset') {
          arr = client.maldata.get('queue');
          newarr = [];
          
          let oarr = [];
          
          for (let i = 0; i < arr.length; i++) {
            oarr.push({
              label: arr[i],
              value: i.toString()
            })
          }
      
          const select = new MessageSelectMenu().addOptions(oarr).setCustomId(`collector:aqueue_select:${code}`);
          const done = new MessageButton().setLabel('Done').setStyle('SUCCESS').setCustomId(`collector:aqueue_done:${code}`);
          const reset = new MessageButton().setLabel('Reset').setStyle('DANGER').setCustomId(`collector:aqueue_reset:${code}`);
          const row = new MessageActionRow().addComponents(select);
          const row2 = new MessageActionRow().addComponents(done, reset);

          interaction.editReply({ embeds: [embed], components: [row, row2] });
        }
      }


    })

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new MessageButton({
      customId,
      label: '🔄',
      style: 'SECONDARY',
    })  
  } 
}

export default AQueueReorderInteraction;
