import { Intents } from 'discord.js';
import * as fs from 'fs';
import express from 'express';
import 'dotenv/config'
import shipyard from './src/boat.js';
import { BoatOptions, UpdatesFile } from './lib/interfaces/Main.js';
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));



const botconfig: BoatOptions = {
    debug: true,
    token: process.env.DISCORD_TOKEN,
    clientOpts: { partials: ['CHANNEL'], intents: Intents.FLAGS.DIRECT_MESSAGES | Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILD_MESSAGE_REACTIONS },
    owners: ['396726969544343554'],
    log: {
      outputFile: process.env.LOG_LOCATION,
      verbose: true,
      webhookToken: process.env.LOG_WEBHOOK,
    },
    commandPrefix: process.env.DISCORD_PREFIX,
    tokens: {
      nasa: process.env.NASA_API_KEY,
    },
  };

const markBot = new shipyard(botconfig);

markBot.log('#', 'Starting...');

markBot.boot();


const client = markBot.client;

let app = express();

app.get('/callback', async ({ query }, response) => {
	const { code, state } = query;

	if (code && state) {
        let user = client.maldata.find(val => Object.keys(val).some(k => {return val[k] === state}));
        if (user) {
            user = Object.keys(user)[0]
            const out = await markBot.rafts.Anime.apis.oauth.getToken(code).catch(err => {markBot.log.verbose(markBot.options.basepath, `Error getting token ${err}`)});
            if (!out.access_token) response.sendFile('error.html', { root: '.' });
            client.maldata.set(user, out.access_token, 'AToken');
            client.maldata.set(user, out.refresh_token, 'RToken');
            client.maldata.set(user, Date.now() + (out.expires_in * 1000), 'EXPD');  
            client.maldata.delete('states', user);
            return response.sendFile('successful.html', { root: '.' });
        }
    }

	return response.sendFile('error.html', { root: '.' });
});

app.listen(process.env.PORT, () => markBot.log('#', `App listening at http://localhost:${process.env.PORT}`));