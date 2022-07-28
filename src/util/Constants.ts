import { ActionRowBuilder, TextInputBuilder } from 'discord.js';
import { JSDOM } from 'jsdom';
import got from 'got';

export const AniQueue = (arr: string[] | []): string => {
  let content = '';

  if (!arr.length) content = 'The queue is currently empty please add something to it using the + button below.'
  else {
    for (let i = 0; i < arr.length; i++) {
      content += `[${i}] ${arr[i]}\n`
    }
  }

  return content;
}

export const getMalUrl = async (dburl: string): Promise<string | null> => {
  if (dburl.includes('https://anidb.net/anime/')) {
    let { body }: { body: any } = await got(`https://relations.yuna.moe/api/ids?source=anidb&id=${dburl.replace('https://anidb.net/anime/', '')}`);
    body = JSON.parse(body);
    if (body?.myanimelist) {
      return `https://myanimelist.net/anime/${body.myanimelist}`
    }
  } else return null
}

export const checkTF = async (url: string): Promise<{ full: boolean; title: string; }> => {
  const { body } = await got(url)
  const dom = new JSDOM(body);
  
  let title = dom.window.document.title;
  title = title.slice(9).replace(' beta - TestFlight - Apple','');

  return {full: body.includes("This beta is full."), title}
}

export const ModalComponents = (arr: TextInputBuilder[]): ActionRowBuilder<TextInputBuilder>[] | null => {
  const finalArr: any[] = []
  arr.forEach(i => {
    if (i instanceof TextInputBuilder) finalArr.push(new ActionRowBuilder().addComponents(i))
  })

  if (finalArr.length == 0) return null
  else return finalArr;
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

export const ComponentFunctions = createEnum(
    ['DELETE', 'AQUEUE_ADD', 'AQUEUE_DELETE', 'AQUEUE_REORDER', 'HALERTS_EDIT', 'HALERTS_RESET']
  );

export const ModalFunctions = createEnum(['TEST']);

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
