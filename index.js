const discord = require('discord.js');
const fs = require("fs");
const cleverbot = require("cleverbot-free");
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const getHTML = require('html-get');
const getHtmlTitle = require('vamtiger-get-html-title').default;
var formatJsonFiles = require('format-json-files');
const { exec } = require('child_process');
var express = require("express");
require('dotenv').config();
const fetch = require('node-fetch');


const shipyard = require('./src/boat');
const botconfig = {
    debug: true,
    token: process.env.DISCORD_TOKEN,
    clientOpts: {},
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


setInterval(tfStuff, 60000);

const client = markBot.client;
var app = express();

app.get('/callback', async ({ query }, response) => {
	const { code, state } = query;

	if (code && state) {
        let user = client.maldata.find(val => Object.keys(val).some(k => {return val[k] === state}));
        if (user) {
            user = Object.keys(user)[0]
            const out = await markBot.rafts.Anime.apis.oauth.getToken(code).catch(err => {markBot.log.verbose(module, `Error getting token ${err}`)});
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

  

async function tfStuff() {
    var tfd = JSON.parse(fs.readFileSync('./test.json', 'utf8'));
		const channel = client.channels.cache.get(config.notchannel);
    for (i = 0; i < tfd["ids"].length; i++) {
        var cid = tfd["ids"][i]
        var l = tfd[cid][0].link
        var s = tfd[cid][0].status

        const html = await getHTML(l).then(({ url, html, stats, headers, statusCode })  => {return html}) 

        var title = getHtmlTitle({ html });        
        var title = title.slice(9);
        var title = title.replace(' beta - TestFlight - Apple','');
        

    if(html.includes("This beta is full.") == true) {

        if(s == "open") {

            const embed = new discord.MessageEmbed()
            .setTitle(title + " - TestFlight Status Update")
            .setURL(l)
            .setDescription("This beta is now full!")
            .setColor("FF0000")
            .setTimestamp();
						channel.send({content: `<@${cid}>`, embed});

        		tfd[cid][0].status = "closed";

						fs.writeFile("./test.json", JSON.stringify(tfd), err => {
								if (err) console.log("Error writing file:", err);
							});        
        
        }
    } else {

        if(s == "closed") {

            const embed = new discord.MessageEmbed()
            .setTitle(title + " - TestFlight Status Update")
            .setURL(l)
            .setDescription("This beta now has slots avalible!")
            .setColor("7fff01")
            .setTimestamp();        
            channel.send({content: `<@${cid}>`, embed})

						tfd[cid][0].status = "open"

						fs.writeFile("./test.json", JSON.stringify(tfd), err => {
								if (err) console.log("Error writing file:", err);
							});        
        
        }

    }

      }
      console.log("Done TF Stuff");
}

