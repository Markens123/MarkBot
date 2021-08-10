import { Intents, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import * as fs from 'fs';
import express from 'express';
import 'dotenv/config'
import { checkTF } from './src/util/Constants.js';
import gplay from 'google-play-scraper';
import store from 'app-store-scraper';
import editJsonFile from 'edit-json-file';
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

client.on('ready', () =>{
  setInterval(Updates, 60000);
});

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

/*client.on('guildMemberAdd', async member => {
    //console.log(member.guild)
    if(member.guild.id !== "816098833054302208") return
    c = member.guild.channels.cache.get("817152710439993385");
    
    const messages = await c.messages.fetch()
    var lm = messages.last()
    if(lm.content == "on") {
        member.kick("Testing is in place")
    }
})*/

  

async function Updates() {
  var data = await JSON.parse(fs.readFileSync('./test.json', 'utf8')) as UpdatesFile[];
  let file = editJsonFile(`${markBot.options.basepath}/../../test.json`);
  const Types = {
    TF: 1,
    ANDROID: 2,
    IOS: 3,
  };
  for (var i in data) {
    let channel = client.channels.cache.get(config.notchannel) as TextChannel;	  
    if (data[i].channel) {
      client.channels.fetch(data[i].channel);
      channel = client.channels.cache.get(data[i].channel) as TextChannel;
    }    
    switch (data[i].type) {
      case Types.TF: {
        const d = await checkTF(data[i].url);
        if (d.full) {
          if (data[i].status === 'open') {
            const content = data[i].mention ? `<@${data[i].mention.join("> <@")}>`: null;
            channel.send({ content, embeds: [tfEmbed(d.full, data[i].url, d.title)] });
            file.set(`${i}.status`, 'closed');
          }
        } else {
          if (data[i].status === 'closed') {
            const content = data[i].mention ? `<@${data[i].mention.join("> <@")}>`: null;
            channel.send({ content, embeds: [tfEmbed(d.full, data[i].url, d.title)] });
            file.set(`${i}.status`, 'open');
          }
        }
        break;
      }
      case Types.ANDROID: {
        let app = await gplay.app({appId: data[i].id});
        if (app.version !== data[i].version && app.updated > data[i].updated) {
          const content = data[i].mention ? `<@${data[i].mention.join("> <@")}>`: null;
          channel.send({ content, embeds: [aEmbed(app, data[i])] });
          file.set(`${i}.version`, app.version);
	        file.set(`${i}.updated`, app.updated);	
        }
        break;
      }
      case Types.IOS: {
        let app = await store.app({id: data[i].id});
        if (app.version !== data[i].version && new Date(app.updated).getTime() > data[i].updated) {
          const content = data[i].mention ? `<@${data[i].mention.join("> <@")}>`: null;
          channel.send({ content, embeds: [iEmbed(app, data[i])] });
          file.set(`${i}.version`, app.version);
	  file.set(`${i}.updated`, new Date(app.updated).getTime());
        }
        break;
      }
    }
    file.save();
  }
  console.log('Done');
}

function tfEmbed(status: boolean, url: string, title: string) {
  if (status) {
    return new MessageEmbed()
    .setTitle(`${title} - TestFlight Status Update`)
    .setURL(url)
    .setDescription('This beta is now full!')
    .setColor("#FF0000")
    .setTimestamp();
  } else {
    return new MessageEmbed()
    .setTitle(`${title} - TestFlight Status Update`)
    .setURL(url)
    .setDescription('This beta now has slots avalible!')
    .setColor('#7fff01')
    .setTimestamp();     
  }
}

function aEmbed(app: gplay.IAppItemFullDetail, data) {
  return new MessageEmbed()
  .setTitle(`${data.title ?? app.title} - Android update`)
  .setURL(app.url)
  .addField('Version', `${data.version} ➝ ${app.version}`)
  .addField('Android Version', app.androidVersionText ?? app.androidVersion)
  .addField('Updated', `<t:${app.updated/1000}:R>`)
  .setColor('#a4c639')
  .setTimestamp();
}

function iEmbed(app, data) {
  let date = new Date(app.updated)
  return new MessageEmbed()
  .setTitle(`${data.title ?? app.title} - iOS update`)
  .setURL(app.url)
  .addField('Version', `${data.version} ➝ ${app.version}`)
  .addField('iOS Version', `${app.requiredOsVersion}+`)
  .addField('Updated', `<t:${date.getTime()/1000}:R>`)
  .setColor('#c0c0c0')
  .setTimestamp();
}
