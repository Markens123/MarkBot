import { ButtonInteraction, ButtonBuilder, Message, EmbedBuilder, MessageComponentInteraction, SnowflakeUtil, SelectMenuBuilder, ActionRowBuilder, SelectMenuInteraction, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ComponentFunctions } from '../../../../util/Constants.js';

class HAlertsEditInteraction extends BaseInteraction {
  definition: () => ButtonBuilder;
  name: string;

  constructor(raft) {
    const info = {
      name: 'HALERTS_EDIT',
      enabled: true,
    };
    super(raft, info);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: ButtonInteraction) {
    const client = this.boat.client;
    const code = SnowflakeUtil.generate();
    const config = client.halerts.get(interaction.guild.id);
    
    const embed = new EmbedBuilder()
    .setTitle('Edit HAlerts Config')
    .setDescription('Preview')
    .addFields([
      {name: 'Channel', value: `<#${config.channel}>`},
      {name: 'Mentions', value: config.mentions?.join(' ') || 'None'}
    ])
    .setColor('NotQuiteBlack');

    let options = [
      {
        label: 'Edit Channel',
        value: 'channel'
      },
      {
        label: 'Edit Mentions',
        value: 'mentions'
      },
    ];

    const select = new SelectMenuBuilder().addOptions(options).setCustomId(`collector:halerts_select:${code}`).setPlaceholder('Select option to edit');
    const done = new ButtonBuilder().setLabel('Done').setStyle(ButtonStyle.Success).setCustomId(`collector:halerts_done:${code}`);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(select);
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(done);



    interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true });

    const filter = (intt: MessageComponentInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code.toString();

    const o = {
      filter,
      idle: 20000
    }


    const collector = interaction.channel.createMessageComponentCollector(o);

    const msgfilter = (msg: Message) => msg.author.id === interaction.user.id;

    const msgoptions = {
      msgfilter,
      idle: 200000,
      max: 1,
    }

    let newchannel = '';
    let newmen = [];

    collector.on('collect', async (int: ButtonInteraction | SelectMenuInteraction) => {

      if (!int.customId.split(':')[1].startsWith('halerts')) {
        int.reply({ content: "These are not the droids you're looking for.", ephemeral: true });
        return
      }

      if (int instanceof SelectMenuInteraction) {

        if (int.values[0] === 'channel') {
          await int.reply({ content: 'Please mention the channel that you would to have the alerts in.', ephemeral: true })

          const resp = await interaction.channel.awaitMessages(msgoptions);
  
          if (!resp.size) int.editReply('No response provided. Please reselect the edit channel option to set it.');
          else {
            const message = resp.first();
            const channel = message.mentions.channels.first();
            newchannel = channel ? channel.id : '';
            message.delete().catch(() => {});

            if (!channel) {
              int.editReply('No response provided. Please reselect the edit channel option to set it.');
              return;
            }
            
            int.editReply(`Great! You've selected <#${newchannel}> to be the new channel. Please click the done button above to set the changes.`);

            const embed = new EmbedBuilder()
              .setTitle('Edit HAlerts Config')
              .setDescription('Preview')
              .addFields([
                {name: 'Channel', value:`<#${newchannel}>`},
                {name: 'Mentions', value: newmen.join(' ') || config.mentions?.join(' ') || 'None'}
              ])
              .setColor('NotQuiteBlack');

            interaction.editReply({ embeds: [embed], components: [row, row2] });
          }

        } else {
          await int.reply({ content: 'Please mention any roles and/or users to be notified when an alert is sent (limit of 5). If you want none to be mentioned send *none*.', ephemeral: true })

          const resp = await interaction.channel.awaitMessages(msgoptions);
  
          if (!resp.size) {
            int.editReply('No response provided. Please reselect the edit mentions option to set it.');
            interaction.editReply({ embeds: [embed], components: [row, row2] });
          }
          else {
            const message = resp.first();
            const members = message.mentions.users;
            const roles = message.mentions.roles;
            

            message.delete().catch(() => {});

            if ((!members.size || !roles.size) && message.content !== 'none') {
              int.editReply('No response provided. Please reselect the edit mentions option to set it.');
              return;
            }
            if (message.content !== 'none') {
              newmen = [];
              members.forEach(u => {
                newmen.push(u.toString())
              });
      
              roles.forEach(r => {
                newmen.push(r.toString())
              });
            } else newmen.push('NONE')

            int.editReply(`Great! ${newmen.includes('NONE') ? 'none': newmen.join(' ')} have been selected. Please click the done button below to set the changes.`);

            const embed = new EmbedBuilder()
              .setTitle('Edit HAlerts Config').setDescription('Preview')
              .addFields([
                {name: 'Channel', value: `<#${newchannel || config.channel}>`},
                {name: 'Mentions', value: newmen.join(' ') || 'None'}
              ])
              .setColor('NotQuiteBlack');

            interaction.editReply({ embeds: [embed], components: [row, row2] });
          }
        }
      } else {

        client.halerts.set(interaction.guild.id, {
          channel: newchannel || config.channel,
          mentions: newmen.includes('NONE') ? [] : newmen.length === 0 ? config.mentions : newmen,
        })
        
        int.reply({ content: 'The changes have been saved!', ephemeral: true })
        
      }
    })

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new ButtonBuilder({
      customId,
      label: '✏️',
      style: ButtonStyle.Secondary,
    })  
  } 
}

export default HAlertsEditInteraction;
