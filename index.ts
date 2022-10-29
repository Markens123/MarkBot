import { GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import { BoatOptions } from './lib/interfaces/Main.js';
import shipyard from './src/boat.js';



const botconfig: BoatOptions = {
    debug: true,
    dev: process.env.DEV ? true : false,
    token: process.env.DISCORD_TOKEN,
    clientOpts: { 
      partials: [Partials.Channel], 
      intents: GatewayIntentBits.DirectMessages | GatewayIntentBits.Guilds 
      | GatewayIntentBits.GuildMessages | GatewayIntentBits.GuildMessageReactions 
      | GatewayIntentBits.MessageContent
    },
    owners: ['396726969544343554'],
    log: {
      outputFile: process.env.LOG_LOCATION,
      verbose: true,
      webhookToken: process.env.LOG_WEBHOOK,
    },
    commandPrefix: process.env.DISCORD_PREFIX,
    tokens: {
      nasa: process.env.NASA_API_KEY,
      ocr: process.env.OCR_API_KEY,
      testflight: process.env.TF_WEBHOOK
    },
  };

const markBot = new shipyard(botconfig);

markBot.log('#', 'Starting...');

markBot.boot();
