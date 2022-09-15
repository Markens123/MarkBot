import { ClientOptions, Snowflake, Collection, Client, PermissionResolvable, Message } from 'discord.js'
import Enmap from 'enmap'
import BaseLoop from '../../src/loops/BaseLoop'
import BaseInteraction from '../../src/rafts/BaseInteraction'

export interface ClientI extends Client {
  cooldowns?: Collection<string, Collection<Snowflake, number>>;
  maldata?: Enmap;
  reminders?: Enmap<Snowflake, Reminder[]>;
  halerts?: Enmap;
  animealerts?: Enmap;
  tasksdata?: Enmap;

  loops?: Collection<string, Loop>;
}

export interface Reminder {
  content: string;
  timestamp: number | string;
  id: number;
}

export interface BoatI {
    options: BoatOptions;
    client: ClientI;
    owners: Snowflake[];
    prefix: string;
    events: any;
    rafts: any;
    commands: any;
    loops: Collection<string, BaseLoop>;
    interactions: InteractionsI;
    token: string;
    debug: boolean;
    ending: boolean;
    log: any;
    end(code: any): Promise<void>;
    readonly toJSON: any;
    launchRaft: any;
    listen: any;
}

export interface InteractionsI {
  commands: Collection<string, BaseInteraction>;
  buttonComponents: Collection<string, BaseInteraction>;
  selectMenuComponents: Collection<string, BaseInteraction>;
  userContextMenuComponents: Collection<string, BaseInteraction>;
  messageContextMenuComponents: Collection<string, BaseInteraction>;
  autocomplete: Collection<string, BaseInteraction>;
  modals: Collection<string, BaseInteraction>;
  subcommands: Collection<string, Collection<string, BaseInteraction>>;
}

export interface CommandOptions {
  name: string;
  description?: string;
  enabled?: boolean;
  owner?: boolean;
  dms?: boolean | 'only';
  threads?: boolean | 'only';
  voice?: boolean | 'only';
  dev?: boolean | 'only';
  args?: ArgI[] | false;
  channels?: Snowflake[] | false;
  guild?: Snowflake[] | Snowflake | false;
  aliases?: string[] | false;
  cooldown?: number | false;
  permissions?: PermissionResolvable | false;
}

export interface BoatOptions {
  debug: boolean;
  token: string;
  clientOpts: ClientOptions;
  owners: Snowflake[];
  dev?: boolean;
  commandPrefix?: string;
  log?: LogOptions;
  basepath?: any;
  tokens?: any;
  channels?: any;
}

export interface RaftI {
  active: boolean;
  commands: undefined | Collection<string, object>;
  apis: any;
  interactions: any;
  boat: BoatI;
}

type ArgDefault = {
  name: string;
  default?: any,
  validation?: ({ arg, message, boat }: { arg: any, message: Message, boat: BoatI }) => any;
  required?: boolean,
  index?: number,
  error?: string
}

type ArgMainOption = {
    type: 'int' | 'integer' | 'string' | 'str' | 'msg',
    flags?: never,
    match?: 'codeblock'
}

type ArgFlagOption = {
    type: 'flag',
    flags: [`--${string}`, `-${string}`],
    match?: never
}

export type ArgI = (ArgDefault  & ArgMainOption ) | (ArgDefault  & ArgFlagOption);

export interface LogOptions {
  maxLevel?: LogLevel;
  outputFile: string;
  verbose: boolean;
  webhookToken: string;
}

export type LogLevel = {
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
    }
}

export interface UpdatesFile {
  type: number;
  title?: string;
  url?: string;
  id?: string;
  status?: string;
  version?: string;
  updated?: number;
  channel?: Snowflake;
  mention?: Snowflake[];
}

export interface HAnime {
  id: number;
  name: string;
  titles: string[];
  slug?: string;
  description: string;
  views: number;
  interests: number;
  poster_url: string;
  cover_url: string;
  brand: string;
  brand_id: number;
  duration_in_ms: number;
  is_censored: boolean;
  rating: number;
  likes: number;
  dislikes: number;
  downloads: number;
  monthly_rank: number;
  tags: string[];
  created_at: number;
  released_at: number;
}

export interface SimpleAnime {
  id: string;
  title: string;
  mal_url: string;
  url: string;
  image: string;
  eps: number;
  alt_titles: string[];
  genres: string[];
  type: AnimeMediaType;
}

export interface AnimeI {
  id: number;
  title: string;
  main_picture: AnimeMainPicture;
  media_type: AnimeMediaType;
  genres: AnimeGenres[];
  alternative_titles: AnimeAltTitles;
}

enum AnimeMediaType {
  tv = 'tv',
  ona = 'ona',
  ova = 'ova',
  movie = 'movie',
  special = 'special',
  music = 'music'
}

type AnimeGenres = {
  id: number,
  name: string
}

type AnimeAltTitles = {
  synonyms: string[],
  en: string,
  ja: string
}

type AnimeMainPicture = {
  medium: string,
  large: string
}


export interface Loop {
  active: boolean;
  boat: BoatI;
  name: string;
  time: number;
  id: NodeJS.Timer;
  iterations: number;
  lasthour: number;
  stop: () => void;
  start: () => void;
  run: () => void;
}
