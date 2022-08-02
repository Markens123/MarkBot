import { ClientOptions, Snowflake, Collection, Client, PermissionResolvable } from 'discord.js'
import Enmap from 'enmap'
import BaseLoop from '../../src/loops/BaseLoop'
import BaseInteraction from '../../src/rafts/BaseInteraction'

export interface ClientI extends Client {
  cooldowns?: Collection<string, Collection<Snowflake, number>>;
  maldata?: Enmap;
  reminders?: Enmap<Snowflake, Reminder[]>;
  halerts?: Enmap;
  animealerts?: Enmap;
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
  guilds?: Snowflake[] | false;
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
  validation?: ({arg: any, message: Message, boat: BoatI}) => any;
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
  image: string;
  eps: number;
  alt_titles: string[];
}

export interface AnimeI {
  id: string;
  type: string;
  links: { self: string };
  attributes: AnimeAttr;
  relationships: AnimeRelationships;
}
interface AnimeRelationships {
  genres: AnimeRelationshipsLink,
  categories: AnimeRelationshipsLink,
  castings: AnimeRelationshipsLink,
  installments: AnimeRelationshipsLink,
  mappings: AnimeRelationshipsLink,
  reviews: AnimeRelationshipsLink,
  mediaRelationships: AnimeRelationshipsLink,
  characters: AnimeRelationshipsLink,
  staff: AnimeRelationshipsLink,
  productions: AnimeRelationshipsLink,
  quotes: AnimeRelationshipsLink,
  episodes: AnimeRelationshipsLink,
  streamingLinks: AnimeRelationshipsLink,
  animeProductions: AnimeRelationshipsLink,
  animeCharacters: AnimeRelationshipsLink,
  animeStaff: AnimeRelationshipsLink
}

type AnimeRelationshipsLink = {
  links: {
    self: string,
    related: string
  }
}

interface AnimeAttr {
  createdAt: string;
  updatedAt: string;
  slug: string;
  synopsis: string;
  titles: AnimeTitles;
  canonicalTitle: string;
  abbreviatedTitles: string[];
  averageRating: string;
  ratingFrequencies: AnimeRatingFrequencies;
  userCount: number;
  favoritesCount: number;
  startDate: string;
  endDate: string;
  popularityRank: number;
  ratingRank: number;
  ageRating: AnimeAgeRating;
  ageRatingGuide: string;
  subtype: AnimeSubType;
  status: AnimeStatus;
  tba: string;
  posterImage: AnimePosterImage;
  coverImage: AnimeCoverImage;
  episodeCount: number;
  episodeLength: number;
  youtubeVideoId: string;
  nsfw: boolean;
}

type AnimeTitles = {
  en: string,
  en_jp: string,
  ja_jp: string,
  [key: string]: string,
}

type AnimeRatingFrequencies = {
  [key: number]: string,
}

enum AnimeAgeRating {
  G = 'G',
  PG = 'PG',
  R = 'R',
  R18 = 'R18'
}

enum AnimeSubType {
  ONA = "ONA",
  OVA = "OVA",
  TV = "TV",
  movie = "movie",
  music = "music",
  special = "special"
}

enum AnimeStatus {
  current = 'current',
  finished = 'finished',
  tba = 'tba',
  unreleased = 'unreleased',
  upcoming = "upcoming"
}

type AnimePosterImage = {
  tiny: string,
  small: string,
  medium: string,
  large: string,
  original: string,
  meta: PosterImageMeta
}

type AnimeCoverImage = {
  tiny: string,
  small: string,
  large: string,
  original: string,
  meta: CoverImageMeta
}

type WH = {
  width: string,
  height: string
}

type CoverImageMeta = {
  dimensions: {
    tiny: WH,
    small: WH,
    large: WH
  }
}

type PosterImageMeta = {
  dimensions: {
    tiny: WH,
    small: WH,
    medium: WH,
    large: WH
  }
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
