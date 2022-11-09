import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder, MessageComponentInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, SnowflakeUtil } from 'discord.js';
import { AniQueue, ComponentFunctions } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class AQueueReorderInteraction extends BaseInteraction {
  definition: () => ButtonBuilder;
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

    const embed = new EmbedBuilder().setTitle('Queue Preview').setDescription('Please add stuff using the select menu!').setColor('NotQuiteBlack')

    let options = [];

    for (let i = 0; i < arr.length; i++) {
      options.push({
        label: arr[i],
        value: i.toString()
      })
    }

    const select = new StringSelectMenuBuilder().addOptions(options).setCustomId(`collector:aqueue_select:${code}`);
    const done = new ButtonBuilder().setLabel('Done').setStyle(ButtonStyle.Success).setCustomId(`collector:aqueue_done:${code}`);
    const reset = new ButtonBuilder().setLabel('Reset').setStyle(ButtonStyle.Danger).setCustomId(`collector:aqueue_reset:${code}`);
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(select);
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(done, reset);



    interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true });

    const filter = (intt: MessageComponentInteraction) => intt.user.id === interaction.user.id  && intt.customId.split(':')[2]  === code.toString();

    const o = {
      filter,
      idle: 15000,
    }


    const collector = interaction.channel.createMessageComponentCollector(o);

    let newarr = []

    collector.on('collect', (int) => {
      return
    })

    collector.on('collect', async (int: ButtonInteraction | StringSelectMenuInteraction) => {

      if (!int.customId.split(':')[1].startsWith('aqueue')) {
        int.reply({ content: "These are not the droids you're looking for", ephemeral: true });
        return
      }

      int.deferUpdate()

      if (int instanceof StringSelectMenuInteraction) {
        let index = int.values[0]
        newarr.push(arr[index])
        arr.splice(index, 1)

        const embed = new EmbedBuilder().setTitle('Preview').setDescription(AniQueue(newarr)).setColor('NotQuiteBlack')

        let oarr = [];
    
        for (let i = 0; i < arr.length; i++) {
          oarr.push({
            label: arr[i],
            value: i.toString()
          })
        }
    
        const select = new StringSelectMenuBuilder().addOptions(oarr).setCustomId(`collector:aqueue_select:${code}`);
        const done = new ButtonBuilder().setLabel('Done').setStyle(ButtonStyle.Success).setCustomId(`collector:aqueue_done:${code}`);
        const reset = new ButtonBuilder().setLabel('Reset').setStyle(ButtonStyle.Danger).setCustomId(`collector:aqueue_reset:${code}`);
        
        if (!arr.length) {
          select.addOptions({value: 'None', label: 'None'});
          select.setDisabled(true);
        }

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(select);
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(done, reset);

        interaction.editReply({ embeds: [embed], components: [row, row2] })

      } else {
        if (int.customId.split(':')[1] === 'aqueue_done') {
          client.maldata.set('queue', newarr)

          const e = new EmbedBuilder().setTitle('Queue').setDescription(AniQueue(newarr)).setColor('Random')

          interaction.channel.messages.cache.get(interaction.message.id).edit({ embeds: [e] }).catch(() => {});

          const select = new StringSelectMenuBuilder().setCustomId(`collector:aqueue_select:${code}`).addOptions({value: 'None', label: 'None'}).setDisabled(true);
          const done = new ButtonBuilder().setLabel('Done').setStyle(ButtonStyle.Success).setCustomId(`collector:aqueue_done:${code}`).setDisabled(true);
          const reset = new ButtonBuilder().setLabel('Reset').setStyle(ButtonStyle.Danger).setCustomId(`collector:aqueue_reset:${code}`);
          
          const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(select);
          const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(done, reset);
  
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
      
          const select = new StringSelectMenuBuilder().addOptions(oarr).setCustomId(`collector:aqueue_select:${code}`);
          const done = new ButtonBuilder().setLabel('Done').setStyle(ButtonStyle.Success).setCustomId(`collector:aqueue_done:${code}`);
          const reset = new ButtonBuilder().setLabel('Reset').setStyle(ButtonStyle.Danger).setCustomId(`collector:aqueue_reset:${code}`);
          const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(select);
          const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(done, reset);

          interaction.editReply({ embeds: [embed], components: [row, row2] });
        }
      }


    })

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new ButtonBuilder({
      customId,
      label: '🔄',
      style: ButtonStyle.Secondary,
    })  
  } 
}

export default AQueueReorderInteraction;
