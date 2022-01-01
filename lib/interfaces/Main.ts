import { ClientOptions, Snowflake, Collection, Client, PermissionResolvable } from 'discord.js'
import Enmap from 'enmap'

export interface ClientI extends Client {
  cooldowns?: Collection<string, Collection<Snowflake, number>>;
  maldata?: Enmap;
  reminders?: Enmap<Snowflake, Reminder[]>;
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

interface InteractionsI {
  commands: Collection<string, any>;
  buttonComponents: Collection<string, any>;
  selectMenuComponents: Collection<string, any>;
  userContextMenuComponents: Collection<string, any>;
  messageContextMenuComponents: Collection<string, any>;
  autocomplete: Collection<string, any>;
}

export interface CommandOptions {
  name: string;
  description?: string;
  enabled?: boolean;
  owner?: boolean;
  dms?: boolean | 'only';
  threads?: boolean | 'only';
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

export interface ArgI {
  name: string;
  type: 'int' | 'integer' | 'string' | 'str' | 'flag' | 'msg';
  index?: number;
  flags?: [string, string];
  default?: any;
  validation?: ({arg: any, message: Message, boat: BoatI}) => any;
  required?: boolean;
  match?: 'codeblock';
  error?: string
}

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
