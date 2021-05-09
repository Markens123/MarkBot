const discord = require('discord.js');
var stringCalculator = require("string-calculator")
const got = require("got");
const fs = require("fs");
const cleverbot = require("cleverbot-free");
const client = new discord.Client();
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
//const captureWebsite = require('capture-website');
const replace = require('replace-in-file');
const trimImage = require('trim-image');
var wait = require('wait');
const imgbbUploader = require("imgbb-uploader");
const getHTML = require('html-get');
const getHtmlTitle = require('vamtiger-get-html-title').default;
var formatJsonFiles = require('format-json-files');
const { ClientBuild } = require('discord-build-info-js');
const clientBuild = new ClientBuild();
var gplay = require('google-play-scraper');
var store = require('app-store-scraper');
const hastebin = require("hastebin-gen");
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


//setInterval(tfStuff, 60000);


var app = express();

app.get('/callback', async ({ query }, response) => {
	const { code, state } = query;
    const client = markBot.client;

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


/*
client.on('guildMemberAdd', async member => {
    //console.log(member.guild)
    if(member.guild.id !== "816098833054302208") return
    c = member.guild.channels.cache.get("817152710439993385");
    
    const messages = await c.messages.fetch()
    var lm = messages.last()
    if(lm.content == "on") {
        member.kick("Testing is in place")
    }
})

  

client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        const server = client.guilds.cache.get(interaction.guild_id);
        
        if(command == 'hello') {
            console.log(await client.api.applications(client.user.id).guilds('274765646217216003').commands.get())
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello World!"
                    }
                }
            });
        }

        if(command == 'eval') {
            const check = config.ownerid;
            if(check == interaction.member.user.id) {
                try { 

                    const code = args.find(arg => arg.name.toLowerCase() == "code").value;
                    let evaled = await eval(code);


                    if (typeof evaled !== "string") {
                    evaled = require("util").inspect(evaled);}
                
                    await client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: clean(evaled)
                            }
                        }
                    });
               } catch(err) {
                    await client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: "ERROR: " + clean(err)
                            }
                        }
                    });
                }
        }   else {
            noPerms(interaction.id, interaction.token);
        }     
    } 

        if(command == 'clear') {
            var check = await checkPerm(interaction.member.user.id, "MANAGE_MESSAGES", interaction.guild_id);
            if(check == true){
                const start = args.find(arg => arg.name.toLowerCase() == "start_id").value;
                const end = args.find(arg => arg.name.toLowerCase() == "end_id").value;
                const messages = await client.api.channels(interaction.channel_id,'messages?limit=100').get();
                var mtd = [];
                var i;
                var s = false;
                console.log(messages.length);
                for (i = 0; i < messages.length; i++) { 
                    console.log(messages[i].id);
                    if(messages[i].id==start) {var s =true;}
                    console.log(s);
                    if(s==true){try{mtd.push(messages[i].id);} catch(error){console.log(error)}}
                    if(messages[i].id==end){var s =false;}
                }
                console.log(mtd);
                 


            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello World!"
                    }
                }
            });
        } else {
            noPerms(interaction.id, interaction.token);
        } 
    }        

        if(command == 'bulkdelete') {
            var check = await checkPerm(interaction.member.user.id, "MANAGE_MESSAGES", interaction.guild_id);
            if(check == true){            
                var n = args.find(arg => arg.name.toLowerCase() == "number").value;
                if(n > 100 || n < 1) {                
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: "Error: You must put a number between 1 and 100!"
                            }
                        }
                    });                   
                } else {
                const messages = await client.api.channels(interaction.channel_id,'messages?limit='+n).get();
                var mtd = [];
                var i;                    
                for (i = 0; i < n; i++) {
                    try {mtd.push(messages[i].id);} catch(error) {}}
                if(mtd.length == 1) {
                    client.api.channels(interaction.channel_id).messages(mtd[0]).delete();
                } else {    
                client.api.channels(interaction.channel_id).messages('bulk-delete').post({
                    data: {
                        messages: mtd
                    }
                });  
                }
                await client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 5
                    }
                });
                sleep(1000);            
                const m = await client.api.channels(interaction.channel_id, 'messages?limit=1').get();
                if(interaction.guild_id == "796163982234615840") {
                    createlog(interaction.channel_id, cmd(command, args), interaction.member.user.id, await makeJumpLink(interaction.guild_id, interaction.channel_id, m[0].id), config.bdlchannel)     
                } else {
                    createlog(interaction.channel_id, cmd(command, args), interaction.member.user.id, await makeJumpLink(interaction.guild_id, interaction.channel_id, m[0].id), config.lchannel)                        
                }
                Patch(client.user.id, interaction.token)

        }
        } else {
            noPerms(interaction.id, interaction.token);
        }
    
        }

        if(command == 'ping') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "My ping is " + client.ws.ping + "!"
                    }
                }
            });
        }



        if(command == 'meme') {

            const res = await (async () => {
                try {
                    const t = await got.get('https://meme-api.herokuapp.com/gimme').json();
                    return t.url;
                } catch (error) {
                    return "An error has occured please send the command again!";  
                }
                
            })();

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: res
                    }
                }
            });

        }      


        if(command == 'calc') {

            const q = args.find(arg => arg.name.toLowerCase() == "input").value;
            const res = await (async () => {
                try {
                    const t = await got.get('https://api.mathjs.org/v4/?expr=' + encodeURIComponent(q));
                    return t.body;
                } catch (error) {
                    return "An error has occured please make sure the input is valid!";  
                }
            })();

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: res
                    }
                }
            });
        } 


        if(command == 'avatar') {
            const u = await (async () => {
            try {    
                return args.find(arg => arg.name.toLowerCase() == "user").value;
        } catch(error) {
            if(!args){return 0;} 
            else {return args.find(arg => arg.name.toLowerCase() == "user_id").value;}}          
        })();
            const res = await (async () => {
                try {var c = await client.api.users(u).get();} catch(error) {return "An error has occured please make sure the user id is valid!";}
                if(c.avatar == null) {var hash = (c.discriminator % 5); var ext = ".png"; 
                return "https://cdn.discordapp.com/embed/avatars/" + hash + ext;
            } 
                else {var hash = c.avatar
                    if(c.avatar.includes("a_") == true){var ext = ".gif"} else {var ext = ".png"};
                };

                return "https://cdn.discordapp.com/avatars/" + u + "/" + hash + ext;
            })();

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        content: res
                    }
                }
            });
        }

        if(command == 'uqt') {
            const u = await (async () => {
            try {    
                return args.find(arg => arg.name.toLowerCase() == "user").value;
        } catch(error) {
            if(!args){return 0;} 
            else {return args.find(arg => arg.name.toLowerCase() == "user_id").value;}}          
        })();
            const av = await (async () => {
                try {var c = await client.api.users(u).get();} catch(error) {return "An error has occured please make sure the user id is valid!";}
                if(c.avatar == null) {var hash = (c.discriminator % 5); var ext = ".png"; 
                return "https://cdn.discordapp.com/embed/avatars/" + hash + ext;
            } 
                else {var hash = c.avatar
                    if(c.avatar.includes("a_") == true){var ext = ".gif"} else {var ext = ".png"};
                };
                return "https://cdn.discordapp.com/avatars/" + u + "/" + hash + ext;
            })();
            var user = await (async () => {
                try {var c = await client.api.users(u).get(); return c;} catch(error) {return "An error has occured please make sure the user id is valid!";}
            })();
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                }
            });            
            var id = Math.floor(Math.random() * 90000) + 10000;

            fs.copyFile('index2.html', id + '.html', (err) => {
                if (err) throw err;
                console.log('files copied');
              });

            var options = {files: id + '.html',from: "AUTHOR",to: user.username,};
            var options2 = {files: id + '.html',from: "AVATAR",to: av,};
            var options3 = {files: id + '.html',from: "COLOR",to: 'FFFFFF',};
            
            (async () => {
            try {
                var results = await replace(options)
                console.log('Replacement results:', results);
                var results = await replace(options2)
                console.log('Replacement results:', results);
                var results = await replace(options3)
                console.log('Replacement results:', results);     
              }
              catch (error) {
                console.error('Error occurred:', error);
              }
            })();  
            

            
                await captureWebsite.file(id + '.html', id + 's.png', {defaultBackground: false, width: 1357, height: 163});
                await trimImage(id + 's.png', id + 'e.png', { top: true, right: true, bottom: true, left: true }, (err) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                });
                console.log("Done with image!");    
            

                await wait(300);

                await imgbbUploader(
                    "757b2573207805521c08a4b12a98af16",
                    "./" + id + 'e.png',
                  )
                  .then((response) => {
                    const embed = new discord.MessageEmbed()
                    .setImage(response.url);
                    
                                
                    client.api.channels(interaction.channel_id).messages.post({
                        data: {
                            content: null,
                            tts: false,
                            embed: embed                  
                        }
                    });
                  })
                  .catch((error) => console.error(error));              




                fs.unlink(id + 'e.png', function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                  }); 
                  fs.unlink(id + 's.png', function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                  });     
                  fs.unlink(id + '.html', function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                  });
        }        
        if(command == 'mention') {

            const user = args.find(arg => arg.name.toLowerCase() == "user").value;

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        content: "Hi <@" + user + "> <@" + interaction.member.user.id + "> wanted to mention you!"
                    }
                }
            });
        }      
        if(command == "embed") {
            var check = await checkPerm(interaction.member.user.id, "MANAGE_MESSAGES", interaction.guild_id);
            if(check == true){     
                const description = args.find(arg => arg.name.toLowerCase() == "content").value;
                const title = args.find(arg => arg.name.toLowerCase() == "title").value;
                const color = args.find(arg => arg.name.toLowerCase() == "color").value;
                var hex = parseInt(color.replace(/^#/, ''), 16);
                const embed = new discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(hex)
                    .setTimestamp()
                    .setFooter('From ' + interaction.member.user.username);

                await client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, embed)
                    }
                });
                sleep(1000);            
                const m = await client.api.channels(interaction.channel_id, 'messages?limit=1').get();
                if(interaction.guild_id == "796163982234615840") {
                    createlog(interaction.channel_id, cmd(command, args), interaction.member.user.id, await makeJumpLink(interaction.guild_id, interaction.channel_id, m[0].id), config.bdlchannel)     
                } else {
                    createlog(interaction.channel_id, cmd(command, args), interaction.member.user.id, await makeJumpLink(interaction.guild_id, interaction.channel_id, m[0].id), config.lchannel)                        
            }        } else {
            noPerms(interaction.id, interaction.token);
        }
    }

    async function createlog(channelid, int, userid, jumplink, lchannel) {
        const user = await client.api.users(userid).get();
        const channel = await client.api.channels(channelid).get();
        const embed = new discord.MessageEmbed()
        .setTitle("Command used in "+channel.name)
        .setDescription("**"+user.username+"#"+user.discriminator+"** used the command **"+int+"** in <#"+channelid+">\n[Jump!]("+jumplink+")")
        .setColor(000000)
        .setTimestamp();        
        client.api.channels(lchannel).messages.post({
        data: {
            content: null,
            tts: false,
            embed: embed
            }
        
    })
    
    
    }


});
*/


async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
    
    return { ...apiMessage.data, files: apiMessage.files };
}

async function checkPerm(uid, p, gid){
    if(p=="CREATE_INSTANT_INVITE"){var b=0x1};
    if(p=="KICK_MEMBERS"){var b=0x2};
    if(p=="BAN_MEMBERS"){var b=0x4};
    if(p=="ADMINISTRATOR"){var b=0x8};
    if(p=="MANAGE_CHANNELS"){var b=0x10};
    if(p=="MANAGE_GUILD"){var b=0x20};
    if(p=="ADD_REACTIONS"){var b=0x40};
    if(p=="VIEW_AUDIT_LOG"){var b=0x80};
    if(p=="PRIORITY_SPEAKER"){var b=0x100};
    if(p=="STREAM"){var b=0x200};
    if(p=="VIEW_CHANNEL"){var b=0x400};
    if(p=="SEND_MESSAGES"){var b=0x800};
    if(p=="SEND_TTS_MESSAGES"){var b=0x1000};
    if(p=="MANAGE_MESSAGES"){var b=0x2000};
    if(p=="EMBED_LINKS"){var b=0x4000};
    if(p=="ATTACH_FILES"){var b=0x8000};
    if(p=="READ_MESSAGE_HISTORY"){var b=0x10000};
    if(p=="MENTION_EVERYONE"){var b=0x20000};
    if(p=="USE_EXTERNAL_EMOJIS"){var b=0x40000};
    if(p=="VIEW_GUILD_INSIGHTS"){var b=0x80000};
    if(p=="CONNECT"){var b=0x100000};
    if(p=="SPEAK"){var b=0x200000};
    if(p=="MUTE_MEMBERS"){var b=0x400000};
    if(p=="DEAFEN_MEMBERS"){var b=0x800000};
    if(p=="MOVE_MEMBERS"){var b=0x1000000};
    if(p=="USE_VAD"){var b=0x2000000};
    if(p=="CHANGE_NICKNAME"){var b=0x4000000};
    if(p=="MANAGE_NICKNAMES"){var b=0x8000000};
    if(p=="MANAGE_ROLES"){var b=0x10000000}; 
    if(p=="MANAGE_WEBHOOKS"){var b=0x20000000}; 
    if(p=="MANAGE_EMOJIS"){var b=0x40000000}; 
    var rl = await client.api.guilds(gid).roles.get();
    var r = await client.api.guilds(gid).members(uid).get();
    var r = r.roles;
    var q;
    var i;
    for (q = 0; q < r.length; q++) {
        for (i = 0; i < rl.length; i++) {
            try {if(rl[i].id==r[q]){var pm=rl[i].permissions}; if((pm&b)==b){var res = 1};} catch(error) {}}}
    if(res == 1){
        return true;
    } else {
        return false;
    }       
}

async function Patch(id, token){
    client.api.webhooks(id, token).messages('@original').patch({data: {content: "​"}});
}

async function noPerms(id, token){
    client.api.interactions(id, token).callback.post({
        data: {
            type: 3, 
            data: {
                flags: 64,
                content: "You do not have permission to use this command!"
            }
        }
    });
}

async function makeJumpLink(gid, cid, mid) {
    const s = "/";
    return "https://discordapp.com/channels/" + gid + s + cid + s + mid 
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function cmd(command, args){
    var a = "/"+command;
    if(!args){return a;} 
    for (i = 0; i < args.length; i++) {
        var a = a + " " + args[i].name + ": " + args[i].value;
    }
    return a;

}

async function tfStuff() {
    var tfd = JSON.parse(fs.readFileSync('./test.json', 'utf8'));

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
            client.api.channels(config.notchannel).messages.post({
            data: {
                content: "<@" + cid + ">",
                tts: false,
                embed: embed
                }
            
        })

        tfd[cid][0].status = "closed"

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
            client.api.channels(config.notchannel).messages.post({
            data: {
                content: "<@" + cid + ">",
                tts: false,
                embed: embed
                }
            
        })

        tfd[cid][0].status = "open"

        fs.writeFile("./test.json", JSON.stringify(tfd), err => {
            if (err) console.log("Error writing file:", err);
          });        
        
        }

    }

      }

      formatJsonFiles('./test.json');
      console.log("Done TF Stuff")


}

function getChannelIDs(fetch) {

    var array = [] 
    {
    try{
        let channels = client.channels.cache.array();
        for (const channel of channels) 
        {
            array.push(channel.id);
            console.log(channel.id);
        }
    }catch(err){
        console.log('array error')
        message.channel.send('An error occoured while getting the channels.')
        console.log(err)
}

return array;
}
}

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

  const CleverBotConvoHistory = [];
  const SHOULD_USE_CONVO_HISTORY = true;
  
  async function chat_clever(msg) {
    
    const answer = await cleverbot(msg, CleverBotConvoHistory);
  
    if (SHOULD_USE_CONVO_HISTORY)
    {
      CleverBotConvoHistory.push(msg);
      CleverBotConvoHistory.push(answer);
    }
  
    return answer;
  }

function promiseExec(action) {
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

function getFromDataURL(u,f){
    fetch(u).then(a=>a.text().then(f));
}

