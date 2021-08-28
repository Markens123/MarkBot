import { ButtonInteraction, InteractionCollectorOptions, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import getHTML from 'html-get';
import { JSDOM } from 'jsdom';

export const checkTF = async (url: string): Promise<{ full: boolean; title: string; }> => {
  const { html } = await getHTML(url);
  const dom = new JSDOM(html);
  let title = dom.window.document.title;
  title = title.slice(9).replace(' beta - TestFlight - Apple','');
  return {full: html.includes("This beta is full."), title}
}

export const LogLevels = {
  console: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5,
  },
  webhook: {
    error: 'BRIGHT_RED',
    warn: 'DEEP_GOLD',
  },
};

export const LogColors = {
  critical: 'bold white redBG',
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
  verbose: 'blue',
};

export const DiscordColors = {
  BRIGHT_RED: 0xff0000,
  CYAN: 0x00ffff,
  DEEP_GOLD: 0xffab32,
};

export const ComponentFunctions = createEnum([]);

function createEnum(keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}

const codeblockRegex = /(?:```(?<language>[A-Za-z0-9\\-\\.]*)\n)(?<content>[\s\S]+)(?:```)/im;

export const getCodeblockMatch = (argument) => {
  const match = codeblockRegex.exec(argument);
  const groups = match?.groups;
  if (groups) {
    const { language, content } = groups;
    if (content && language) return { language, content };
    else if (content) return { content };
  } else return { content: argument };
}

export const Paginator = async (message: Message, data: any, offset = 0, length = 1, callback: ({ data, offset, message }: { data: any, offset: number, message?: Message }) => any, options: InteractionCollectorOptions<ButtonInteraction>) => {
  let currentIndex = offset;
  
  const embed = callback({ data, offset: currentIndex, message });

  const msg = await message.channel.send({ embeds: [embed] })

  const collector = msg.createMessageComponentCollector(options);

  if (!msg.components.length) {
    let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next');
    let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back');
    let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId(`collector:delete:${message.author.id}`);
    
    if (currentIndex === 0) back.setDisabled(true);
    if (currentIndex + 1 >= length) next.setDisabled(true);

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
    const del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId(`collector:delete:${message.author.id}`);

    interaction.deferUpdate();

    interaction.customId === 'collector:back' ? (currentIndex -= 1) : (currentIndex += 1);

    if (currentIndex === 0) back.setDisabled(true);
    if (currentIndex + 1 >= length) next.setDisabled(true);

    const row = new MessageActionRow().addComponents(back, next, del);

    const e = callback({ data, offset: currentIndex, message });

    msg.edit({ embeds: [e], components: [row] }).catch(() => {});
  });

  collector.on('end', () => {
    let next = new MessageButton().setLabel('➡️').setStyle('PRIMARY').setCustomId('collector:next').setDisabled(true);
    let back = new MessageButton().setLabel('⬅️').setStyle('PRIMARY').setCustomId('collector:back').setDisabled(true);
    let del = new MessageButton().setLabel('🗑️').setStyle('DANGER').setCustomId(`collector:delete:${message.author.id}`);
    
    if (length === 1) {
      next = null;
      back = null;
    }

    let row = new MessageActionRow().addComponents([back, next, del].filter(x => x));

    msg.edit({ components: [row] }).catch(() => {});

  });
}