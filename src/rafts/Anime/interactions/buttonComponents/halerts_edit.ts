import { ButtonInteraction, MessageButton, Message, MessageEmbed, Snowflake, SnowflakeUtil, MessageSelectMenu, MessageActionRow, SelectMenuInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ComponentFunctions } from '../../../../util/Constants.js';

class HAlertsEditInteraction extends BaseInteraction {
  definition: () => MessageButton;
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

    const embed = new MessageEmbed().setTitle('Edit HAlerts Config').setDescription('Preview').addField('Channel', `<#${config.channel}>`).addField('Mentions', config.mentions ? config.mentions.join(' ') : 'None').setColor('NOT_QUITE_BLACK');

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

    const select = new MessageSelectMenu().addOptions(options).setCustomId(`collector:halerts_select:${code}`).setPlaceholder('Select option to edit');
    const done = new MessageButton().setLabel('Done').setStyle('SUCCESS').setCustomId(`collector:halerts_done:${code}`);

    const row = new MessageActionRow().addComponents(select);
    const row2 = new MessageActionRow().addComponents(done);



    interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true });

    const filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code;

    const o = {
      filter,
      idle: 15000
    }


    const collector = interaction.channel.createMessageComponentCollector(o);

    const msgfilter = (msg: Message) => msg.author.id === interaction.user.id;

    const msgoptions = {
      msgfilter,
      idle: 15000,
      max: 1,
    }

    let newchannel = '';
    let newmen = [];

    collector.on('collect', async (int: ButtonInteraction | SelectMenuInteraction) => {

      if (!int.customId.split(':')[1].startsWith('halerts')) return int.reply({ content: "These are not the droids you're looking for.", ephemeral: true });

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
            
            int.editReply(`Great! You've selected <#${newchannel}> to be the new channel. Please click the done button below to set the changes.`);

            const embed = new MessageEmbed().setTitle('Edit HAlerts Config').setDescription('Preview').addField('Channel', `<#${newchannel}>`).addField('Mentions', newmen?.length ? newmen.join(' ') : 'None').setColor('NOT_QUITE_BLACK');

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
            } else newmen = undefined

            int.editReply(`Great! ${newmen?.length ? newmen.join(' ') : 'none'} have been selected. Please click the done button below to set the changes.`);

            const embed = new MessageEmbed().setTitle('Edit HAlerts Config').setDescription('Preview').addField('Channel', `<#${newchannel}>`).addField('Mentions', newmen?.length ? newmen.join(' ') : 'None').setColor('NOT_QUITE_BLACK');

            interaction.editReply({ embeds: [embed], components: [row, row2] });
          }
        }
      } else {

        if (!newchannel) return int.reply('Please add a channel')

        console.log(newmen, newchannel);

        client.halerts.set(interaction.guild.id, {
          channel: newchannel,
          newmen,
        })
        
        int.reply({ content: 'The changes have been saved!', ephemeral: true })
        
      }
    })

  }

  generateDefinition() {
    const customId = `${ComponentFunctions[this.name]}`;
    return new MessageButton({
      customId,
      label: '✏️',
      style: 'SECONDARY',
    })  
  } 
}

export default HAlertsEditInteraction;
