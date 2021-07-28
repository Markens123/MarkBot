import { ClientOptions, Snowflake, Collection, Client } from 'discord.js'
import Enmap from 'enmap'

export interface ClientI extends Client {
  cooldowns?: Collection<string, Collection<Snowflake, number>>;
  maldata?: Enmap;
  rdata?: Enmap;
  overrides?: Enmap;
}

export interface BoatI {
    options: BoatOptions;
    client: ClientI;
    owners: Snowflake[];
    prefix: string;
    events: any;
    rafts: any;
    commands: any;
    interactions: any;
    token: string;
    debug: boolean;
    ending: boolean;
    log: any;
    end(code: any): Promise<void>;
    readonly toJSON: any;
  }

export interface BoatOptions {
    debug: boolean;
    token: string;
    clientOpts: ClientOptions;
    owners: Snowflake[];
    commandPrefix?: string;
    log?: LogOptions;
    basepath?: any;
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
  type: 'int' | 'integer' | 'string' | 'str' | 'flag';
  index?: number;
  flags?: string[];
  default?: any;
  validation?: any;
  required?: boolean;
  match?: 'codeblock';
}

export interface LogOptions {
    maxLevel: LogLevel;
    outputFile: string;
    verbose: boolean;
    webhookToken: Snowflake;
}

export interface CaptinsLogI extends RaftI {
  
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

