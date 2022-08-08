import { ChatInputCommandInteraction, Message, ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class HAlertsInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'halerts',
      guild: '816098833054302208',
      enabled: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;

    const filter = (msg: Message) => msg.author.id === interaction.user.id;

    const options = {
      filter,
      idle: 15000,
      max: 1,
    }

    if (!client.halerts.get(interaction.guild.id)) {
      interaction.reply("It looks like hen alerts aren't setup in this server yet.\nTo start setup please mention the channel that you would to have the alerts in.\nIf you didn't mean to start setup just send *no*")
  
      const resp = await interaction.channel.awaitMessages(options);
  
      if (!resp.size) return interaction.editReply('No response provided. Please do /halerts again to start setup.');
  
      const message = resp.first();
      const channel = message.mentions.channels.first();
      
      if (message.content === 'no' || !channel) {
        message.delete().catch(() => {});
        return interaction.deleteReply();
      }

      interaction.editReply(`Great! Alerts will be sent to ${channel.toString()}. Now please mention any roles and/or users to be notified when an alert is sent (limit of 5).\nIf you don't want any just send *none*`);
      message.delete().catch(() => {});

      const resp2 = await interaction.channel.awaitMessages(options);
  
      if (!resp2.size) return interaction.editReply('No response provided. Please do /halerts again to start setup.');

      const message2 = resp2.first();
      const members = message2.mentions.users;
      const roles = message2.mentions.roles;

      let mentions = [];

      message2.delete().catch(() => {});

      if ((!members.size || !roles.size) || message2.content === 'none' || message2.content === 'no') {
        mentions = undefined;
      }
      
      if (mentions) {
        members.forEach(u => {
          mentions.push(u.toString())
        });

        roles.forEach(r => {
          mentions.push(r.toString())
        });
      }

      client.halerts.set(interaction.guild.id, {
        channel: channel.id,
        mentions,
      })

      return interaction.editReply('Setup is complete! You can now do /halerts to view and edit the server config.')
    }
    
    const config = client.halerts.get(interaction.guild.id);

    let embed = new EmbedBuilder()
      .setTitle('HAlerts Config')
      .addFields([
        {name: 'Channel', value: `<#${config.channel}>`},
        {name: 'Mentions', value: config.mentions ? config.mentions.join(' ') : 'None'}
      ]);

    const reset = this.boat.interactions.buttonComponents.get('HALERTS_RESET').definition();
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(reset);

    interaction.reply({ embeds: [embed], components: [row] });
  }
}

function getDefinition() {
  return {
    name: 'halerts',
    description: 'Command to setup or edit hen alerts.',
  }
}

export default HAlertsInteraction;
