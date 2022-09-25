import { ActionRowBuilder, EmbedBuilder, TextInputBuilder } from 'discord.js';
import got from 'got';
import { JSDOM } from 'jsdom';
import { Item, Task } from '../../lib/interfaces/Main';

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

export const TaskMessage = (task: Task) => {
  const body = task.body;
  const id = task.id;
  const items = task.items ?? {};
  const completed = Object.values(items).filter(x => x.completed).length;
  let todo = '';
  let count = '';
  let closed = task.open ? '' : '\nTASK CLOSED';

  if (!items || Object.keys(items).length === 0) {
    todo = '\nNone'
  } else {
    for (const x in items) {
      const i = items[x] as Item;
      let emoji = i.completed ? Emojis.greentick : Emojis.greytick; 
      todo += `\n${emoji} ${i.body}`      
    }
    count = ` (${completed}/${Object.keys(items).length})`
  }

  return `${body}\n--------------------\nTODO${count}:${todo}\n--------------------\nID: ${id}${closed}`
}

export const Emojis = {
  greentick: '<:greentick:1021079237488287896>',
  redtick: '<:redtick:1021079236833972294>',
  greytick: '<:greytick:1021079238943711292>'
}

export const getMalUrl = async (dburl: string): Promise<string | null> => {
  let id: string;
  let source: string;

  if (dburl.includes('https://anidb.net/anime/')) {
    id = dburl.replace('https://anidb.net/anime/', '');
    source = 'anidb'

  } else if (dburl.includes('https://kitsu.io/api/edge/anime/')) {
    id = dburl.replace('https://kitsu.io/api/edge/anime/', '')
    source = 'kitsu'
  } else return null

  let { body }: { body: any } = await got(`https://relations.yuna.moe/api/ids?source=${source}&id=${id}`);
  body = JSON.parse(body);
  if (body?.myanimelist) {
    return `https://myanimelist.net/anime/${body.myanimelist}`
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

export const ComponentFunctions = createEnum([
  'DELETE', 
  'AQUEUE_ADD', 
  'AQUEUE_DELETE', 
  'AQUEUE_REORDER', 
  'HALERTS_EDIT', 
  'HALERTS_RESET', 
  'TASK_OPTIONS',
  'ITEM_SELECT',
]);

export const ModalFunctions = createEnum([
  'TEST', 
  'TASK_CREATE', 
  'TASK_EDIT', 
  'ITEM_ADD',
  'ITEM_EDIT',
]);

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

export const loop = (num: number, func: (j: number) => void, start: number = 1): void => {
  for (let index = start; index < num+start; index++) {
    func(index)
  }
}

export const ChunkEmbeds = (embeds: EmbedBuilder[], callback: (e: EmbedBuilder[]) => void): void => {
  
  callback(
    [].concat(...embeds.map((elem, i) => (i % 10 ? [] : embeds.slice(i, i + 10))))
  )
  

}

export const range = (start: number, stop: number, step: number): number[] => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));