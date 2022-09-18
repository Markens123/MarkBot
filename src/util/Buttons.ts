import { ButtonInteraction, InteractionCollectorOptions, Message, ActionRowBuilder, ButtonBuilder, SnowflakeUtil, CommandInteraction, User, MessageActionRowComponentBuilder, ButtonStyle, MessageComponentCollectorOptions, SelectMenuInteraction, MessageComponentType, ComponentType, Interaction, ChatInputCommandInteraction, Snowflake } from 'discord.js';
import { BoatI } from '../../lib/interfaces/Main.js';

export const Paginator = async ({boat, message, data, offset = 0, length = 1, callback, options}: {
  boat: BoatI,
  message: Message,
  data: any,
  offset?: number,
  length?: number,
  callback: ({ data, offset, message }: { data: any, offset: number, message?: Message }) => any,
  options: MessageComponentCollectorOptions<ButtonInteraction>
  }) => {
    let currentIndex = offset;
    
    const embed = await callback({ data, offset: currentIndex, message });

    const msg = await message.channel.send({ embeds: [embed] });

    //@ts-expect-error
    const collector = msg.createMessageComponentCollector(options);

    if (!msg.components.length) {
      let next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId('collector:next');
      let back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId('collector:back');
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);
      
      if (currentIndex === 0) back.setDisabled(true)
      if (currentIndex + 1 >= length) next.setDisabled(true)

      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([back, next, del].filter(x => x))

      
      
      msg.edit({ components: [row] }).catch(() => {});
    }

    collector.on('collect', async (interaction) => {
      const next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId('collector:next');
      const back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId('collector:back');
      const del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);

      interaction.deferUpdate();

      interaction.customId === 'collector:back' ? (currentIndex -= 1) : (currentIndex += 1);

      if (currentIndex === 0) back.setDisabled(true);
      if (currentIndex + 1 >= length) next.setDisabled(true);

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(back, next, del);

      const e = await callback({ data, offset: currentIndex, message });

      msg.edit({ embeds: [e], components: [row] }).catch(() => {});
    });

    collector.on('end', () => {
      let next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId('collector:next').setDisabled(true);
      let back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId('collector:back').setDisabled(true);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(message.author.id);
      
      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([back, next, del].filter(x => x));

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

    options.filter = (intt: ButtonInteraction) => intt.user.id === interaction.user.id && intt.customId.split(':')[2] === code.toString();

    const collector = interaction.channel.createMessageComponentCollector(options);

    if (!msg.components.length) {
      let next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId(`collector:next:${code}`);
      let back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId(`collector:back:${code}`);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);
      
      if (currentIndex === 0) back.setDisabled(true)
      if (currentIndex + 1 >= length) next.setDisabled(true)

      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([back, next, del].filter(x => x))

      
      if (editreply) interaction.editReply({ components: [row] }).catch(() => {})
      else msg.edit({ components: [row] }).catch(() => {})
    }

    collector.on('collect', async (int) => {
      const next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId(`collector:next:${code}`);
      const back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId(`collector:back:${code}`);
      const del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);

      int.deferUpdate();

      int.customId === `collector:back:${code}` ? (currentIndex -= 1) : (currentIndex += 1);

      if (currentIndex === 0) back.setDisabled(true);
      if (currentIndex + 1 >= length) next.setDisabled(true);

      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(back, next, del);

      const e = await callback({ data, offset: currentIndex, interaction });


      if (editreply) interaction.editReply({ embeds: [e], components: [row] }).catch(() => {})
      else msg.edit({ embeds: [e], components: [row] }).catch(() => {})
    });

    collector.on('end', () => {
      let next = new ButtonBuilder().setLabel('➡️').setStyle(ButtonStyle.Primary).setCustomId(`collector:next:${code}`).setDisabled(true);
      let back = new ButtonBuilder().setLabel('⬅️').setStyle(ButtonStyle.Primary).setCustomId(`collector:back:${code}`).setDisabled(true);
      let del = boat.rafts.portAuthority.interactions.buttonComponents.get('DELETE').definition(interaction.user.id);
      
      if (length === 1) {
        next = null;
        back = null;
      }

      let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([back, next, del].filter(x => x));

      if (editreply) interaction.editReply({ components: [row] }).catch(() => {})
      else msg.edit({ components: [row] }).catch(() => {})

    });
}

export const YesNo = async ({ message, content, user_id = message.author.id }: 
  {
    message: Message,
    content: string,
    user_id?: string | Snowflake 
  }): Promise<boolean | null> => {
  const yes = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(`collector:yes`).setLabel('Yes');
  const no = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`collector:no`).setLabel('No');
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(yes, no);
  content = content.replace('{user}', `<@${user_id}>`); 

  const msg = await message.channel.send({content, components: [row]})
  const filter = (interaction: ButtonInteraction) => interaction.user.id === user_id;
  
  const options = { 
    filter,
    idle: 15000 
  }

  try {
    //@ts-expect-error
    const int = await msg.awaitMessageComponent(options);

    if (!(int instanceof Error)) {
      msg.delete().catch(() => {});

      if (int.customId === 'collector:yes') return true
      else return false
    
    } else return null;

  } catch(error) {
    msg.delete().catch(() => {});
    return null
  }
}

export const InteractionYesNo = async ({ interaction, content, editReply = false, user_id = interaction.user.id }: 
  {
    interaction: ChatInputCommandInteraction | ButtonInteraction, 
    content: string,
    editReply?: boolean,
    user_id?: string | Snowflake 
  }): Promise<boolean> => {
  const code = SnowflakeUtil.generate();
  const yes = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(`collector:yes:${code}`).setLabel('Yes');
  const no = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`collector:no:${code}`).setLabel('No');
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(yes, no);
  let msg: Message;
  content = content.replace('{user}', `<@${user_id}>`);


  if (editReply) msg = await interaction.editReply({ content, components: [row], allowedMentions: { parse: ['users', 'roles', 'everyone'] } });
  else msg = await interaction.channel.send({content, components: [row]})

  const filter = (intt) => intt.user.id === user_id && intt.customId.split(':')[2] == code.toString();
  
  const options = {
    filter,
    idle: 15000 
  }

  try {
    const int = await interaction.channel.awaitMessageComponent(options);

    if (!(int instanceof Error)) {
      int.deferUpdate()
      if (!editReply) msg.delete().catch(() => {});
      

      if (int.customId.startsWith('collector:yes')) return true
      else return false
    
    } else return null;

  } catch(error) {
    if (!editReply) msg.delete().catch(() => {});
    return null
  }
} 