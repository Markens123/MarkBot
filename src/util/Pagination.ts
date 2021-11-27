import { ButtonInteraction, InteractionCollectorOptions, Message, MessageActionRow, MessageButton, SnowflakeUtil, CommandInteraction } from 'discord.js';
import { BoatI } from '../../lib/interfaces/Main.js';

export const Paginator = async ({boat, message, data, offset = 0, length = 1, callback, options}: {
  boat: BoatI,
  message: Message,
  data: any,
  offset?: number,
  length?: number,
  callback: ({ data, offset, message }: { data: any, offset: number, message?: Message }) => any,
  options: InteractionCollectorOptions<ButtonInteraction>
  }) => {
    let currentIndex = offset;
    
    const embed = await callback({ data, offset: currentIndex, message });

    const msg = await message.channel.send({ embeds: [embed] });

    const collector = msg.createMessageComponentCollector(options);

    if (!msg.components.length) {
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next');
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back');
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);
      
      if (currentIndex === 0) back.setDisabled(true)
      if (currentIndex + 1 >= length) next.setDisabled(true)

      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new MessageActionRow().addComponents([back, next, del].filter(x => x))

      
      
      msg.edit({ components: [row] }).catch(() => {});
    }

    collector.on('collect', async (interaction) => {
      const next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next');
      const back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back');
      const del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);

      interaction.deferUpdate();

      interaction.customId === 'collector:back' ? (currentIndex -= 1) : (currentIndex += 1);

      if (currentIndex === 0) back.setDisabled(true);
      if (currentIndex + 1 >= length) next.setDisabled(true);

      const row = new MessageActionRow().addComponents(back, next, del);

      const e = await callback({ data, offset: currentIndex, message });

      msg.edit({ embeds: [e], components: [row] }).catch(() => {});
    });

    collector.on('end', () => {
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next').setDisabled(true);
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back').setDisabled(true);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);
      
      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new MessageActionRow().addComponents([back, next, del].filter(x => x));

      msg.edit({ components: [row] }).catch(() => {});

    });
}

export const InteractionPaginator = async ({boat, interaction, data, offset = 0, length = 1, callback, options, editreply = false}: {
  boat: BoatI,
  interaction: any, 
  data: any, 
  offset?: number, 
  length?: number, 
  callback: ({ data, offset, interaction }: { data: any, offset: number, interaction?: CommandInteraction }) => any, 
  options: InteractionCollectorOptions<ButtonInteraction>, 
  editreply?: boolean
  }) => {
    let currentIndex = offset;
    const code = SnowflakeUtil.generate();

    const embed = await callback({ data, offset: currentIndex, interaction });
    let msg: Message;


    if (editreply) msg = await interaction.editReply({ content: null, embeds: [embed] }) as Message;
    else msg = await interaction.channel.send({ embeds: [embed] })

    options.filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code;

    const collector = interaction.channel.createMessageComponentCollector(options);

    if (!msg.components.length) {
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`);
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);
      
      if (currentIndex === 0) back.setDisabled(true)
      if (currentIndex + 1 >= length) next.setDisabled(true)

      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new MessageActionRow().addComponents([back, next, del].filter(x => x))

      
      if (editreply) interaction.editReply({ components: [row] }).catch(() => {})
      else msg.edit({ components: [row] }).catch(() => {})
    }

    collector.on('collect', async (int) => {
      const next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`);
      const back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`);
      const del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);

      int.deferUpdate();

      int.customId === `collector:back:${code}` ? (currentIndex -= 1) : (currentIndex += 1);

      if (currentIndex === 0) back.setDisabled(true);
      if (currentIndex + 1 >= length) next.setDisabled(true);

      const row = new MessageActionRow().addComponents(back, next, del);

      const e = await callback({ data, offset: currentIndex, interaction });


      if (editreply) interaction.editReply({ embeds: [e], components: [row] }).catch(() => {})
      else msg.edit({ embeds: [e], components: [row] }).catch(() => {})
    });

    collector.on('end', () => {
      let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId(`collector:next:${code}`).setDisabled(true);
      let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId(`collector:back:${code}`).setDisabled(true);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);
      
      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new MessageActionRow().addComponents([back, next, del].filter(x => x));

      if (editreply) interaction.editReply({ components: [row] }).catch(() => {})
      else msg.edit({ components: [row] }).catch(() => {})

    });
}