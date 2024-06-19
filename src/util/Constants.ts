import { ActionRowBuilder, EmbedBuilder, TextInputBuilder } from 'discord.js';
import got from 'got';
import { JSDOM } from 'jsdom';
import { DiscordBuild, Item, Task } from '../../lib/interfaces/Main';
import { exec } from 'child_process';

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
  title = title.slice(9).replace(' beta - TestFlight - Apple', '');

  return { full: body.includes("This beta is full."), title }
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
  'GENERATE_NEW',
  'TEST_BUTTONS',
  'ANIMEALERTS_MENTIONS',
  'ANIMEALERTS_SELECT',
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
  for (let index = start; index < num + start; index++) {
    func(index)
  }
}

export const ChunkEmbeds = (embeds: EmbedBuilder[], callback: (e: EmbedBuilder[]) => void): void => {
  callback(
    [].concat(...embeds.map((elem, i) => (i % 10 ? [] : embeds.slice(i, i + 10))))
  )
}

export const shorten = (str, maxLen, separator = ' ') => {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export const range = (start: number, stop: number, step: number): number[] => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));

export const discVer = (channel: 'ptb' | 'stable' | 'canary' = 'stable'): Promise<DiscordBuild> => {
  return new Promise(async (resove, reject) => {
    const branches = ['ptb', 'stable', 'canary'];
    if (!branches.includes(channel)) return reject('Invalid branch');
    const mainurl = channel === 'stable' ? 'https://discord.com/app' : `https://${channel}.discord.com/app`;

    const { body: mbody, headers: mheaders } = await got.get(mainurl);
    let buildHash = mheaders["x-build-id"] as string;

    const jsurl = mbody.match(/([a-zA-z0-9]+)\.js" /g).map(x => x.replace('" ', '')).pop();

    if (!jsurl) {
      return reject('Js file not found');
    }

    const sourceurl = channel === 'stable' ? `https://discord.com/assets/${jsurl}` : `https://${channel}.discord.com/assets/${jsurl}`;

    const { body: sbody } = await got.get(sourceurl);

    let buildstrings: any = sbody.match(/Build Number: (?:\"\).concat\(\")?(\d+)/);

    if (buildstrings && buildstrings[1] && parseInt(buildstrings[1])) buildstrings = parseInt(buildstrings[1])
    else reject('Build number invalid')

    resove({
      buildNum: buildstrings.toString(),
      buildID: buildHash.slice(0, 7),
      buildHash,
    })
  })
}

export const promiseExec = (action): Promise<any> => {
  return new Promise((resolve, reject) =>
    exec(action, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    }),
  );
}

export const clean = (text: string): string => {
  if (typeof text === 'string') {
    return text.replace(/` /g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`).trim();
  }
  return text;
}

export const awaitTimelimit = async <T, J>(timeLimit: number, task: Promise<T>, failureValue: J): Promise<T | J> => {
  let timeout;
  const timeoutPromise = new Promise((resolve: (value: J) => void) => {
    timeout = setTimeout(() => {
      resolve(failureValue);
    }, timeLimit);
  });
  const response = await Promise.race([task, timeoutPromise]);
  if (timeout) {
    clearTimeout(timeout);
  }
  return response;
}

export const eightball = {
  answers: [
    'it is certain',
    'it is decidedly so',
    'without a doubt',
    'yes, definitely',
    'you may rely on it',
    'as I see it, yes',
    'most likely',
    'outlook good',
    'Yes',
    'My signs point to yes',
    'reply hazy, try again',
    'ask again later',
    'better not tell you now',
    'cannot predict now',
    'concentrate and ask again',
    'dont count on it',
    'my reply is no',
    'my sources say no',
    'outlook not so good',
    'very doubtful'
  ],
  getAnswer: function () {
    // choose a random number between 0 and 19
    // (this corresponds to the index of our answers array)
    const answer = Math.floor(Math.random() * 20)
    // return the answer corresponding to the random number
    return this.answers[answer]
  }
}