const discord = require('discord.js');
const Discord = require('discord.js');
const { memeAsync } = require('memejs');
const { meme } = require('memejs');
const ball = require("8ball.js");
var stringCalculator = require("string-calculator")
const got = require("got");
const fs = require("fs");
var path = require('path');
const cleverbot = require("cleverbot-free");
const ytdl = require('ytdl-core');
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
const { basename } = require('path');
const { SSL_OP_TLS_ROLLBACK_BUG } = require('constants');
var pm2 = require('pm2');


pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }  
});


setInterval(tfStuff, 60000); 

client.on('message', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return; 
    const args = message.content.slice('!'.length).trim().replace(/  +/g, ' ').split(' ');
    const command = args.shift().toLowerCase()


    if((message.channel.id == "792919194936147985") && (message.author.id !== "762369554864537620") && (message.type == "DEFAULT")) {
        //chat_clever(message.content).then(t => {message.channel.send(t)})
        //client.api.channels("744947742857756812").messages.post({data:{content: message.content, tts: false}})

    }
    /*if(message.content.includes("hastebin" || "pastebin")) {
        var input = message.content
        var expression = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
        var matches = input.match(expression);
        var results = [];
        for(match in matches)
        {
            var result = {};
            result = matches[match];
        results.push(result);      
        }


        getFromDataURL('https://pastebin.com/raw/PzgesDhD',(a)=>c=a); 816693257199157308
    }*/
    if((command == "echo") && (message.author.id !== "762369554864537620")) {
          message.channel.send(message.content.slice(command.length + '!'.length))

    }
    /*if((command == "minfo") && (message.author.id !== "762369554864537620")) {
        //const m = await message.channel.messages.fetch(args[0])
        var a = getChannelIDs(message.guild.id)

        var ttest = a.forEach(async e => { 
            var c = client.channels.cache.get(e)

            await c.messages.fetch(args[0]).catch(err => console.log(err))
        });

        console.log(ttest)
          

  }*/


  });

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

  
client.on('ready', () => {
    console.log('ready');

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "hello",
            description: "Replies with Hello World!"
        }
    });

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "checktf",
            description: "Check's the status of Discord TestFlight."
        }
    });

    client.api.applications(client.user.id).commands.post({
        data: {
            name: "shrug",
            description: "Just shrug"
        }
    });    

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "discordver",
            description: "Check all the current discord versions."
        }
    });   
    
    client.api.applications(client.user.id).commands.post({
        data: {
            name: "noresp",
            description: "This won't send a response."
        }
    });      


    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "eval",
            description: "Evaluate text as javascript code. Must be Markens to use this command",

            options: [
            {
                name: "code",
                description: "Text to evaluate",
                type: 3,
                required: true
            }

            ]
        }
    });        
   

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "mention",
            description: "Mentions any user for you",

            options: [
            {
                name: "user",
                description: "User to mention",
                type: 6,
                required: true
            }

            ]
        }
    });    

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "atol",
            description: "Converts imgur album link to direct links",

            options: [
            {
                name: "hash",
                description: "The last string in the link",
                type: 3,
                required: true
            }

            ]
        }
    });     


    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "avatar",
            description: "Gets the avatar of any user",

            options: [
            {
                name: "user",
                description: "User to get the avatar from. Use this if you don't want to use the id!",
                type: 6,
                required: false
            },
            {
                name: "user_id",
                description: "User to get the avatar from. Use this if you're going to use the id!",
                type: 3,
                required: false
            }            

            ]
        }
    });
    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "uqt",
            description: "Sends an image of the user saying \"I'm a qt\"",

            options: [
            {
                name: "user",
                description: "User that is saying \"I'm a qt\". Use this if you don't want to use the id!",
                type: 6,
                required: false
            },
            {
                name: "user_id",
                description: "User that is saying \"I'm a qt\". Use this if you're going to use the id!",
                type: 3,
                required: false
            }            

            ]
        }
    });



    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "meme",
            description: "Sends a random meme"
        }
    });  


    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "onlyme",
            description: "Sends a message that you can only see"
        }
    });  

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "ping",
            description: "Sends the bot\'s ping"
        }
    });  

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "8ball",
            description: "The Magic 8 Ball Oracle has answer to all the questions",
            options: [
                {
                    name: "question",
                    description: "Question to ask",
                    type: 3,
                    required: true
                }
    
                ]            
        }
    });      

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "bulkdelete",
            description: "Bulk deletes messages for you.",
            options: [
                {
                    name: "number", 
                    description: "Number of messages to delete",
                    type: 4,
                    required: true
                }
    
                ]            
        }
    });
    
    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "clear",
            description: "Clears all messages between the 2 given ids",
            options: [
                {
                    name: "start_id",
                    description: "The message to start",
                    type: 4,
                    required: true
                },
                {
                    name: "end_id",
                    description: "The message to end",
                    type: 4,
                    required: true
                }                
    
                ]            
        }
    });       


    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "calc",
            description: "Calculate",
            options: [
                {
                    name: "input",
                    description: "What to calculate",
                    type: 3,
                    required: true
                }
    
                ]            
        }
    });
    client.api.applications(client.user.id).commands.post({
        data: {
            name: "test",
            description: "Test stuff",
            options: [
                {
                    name: "string",
                    description: "Sequence of characters",
                    type: 3,
                    required: false
                },
                {
                    name: "integer",
                    description: "Whole numbers",
                    type: 4,
                    required: false
                },
                {
                    name: "boolean",
                    description: "True or false",
                    type: 5,
                    required: false
                },
                {
                    name: "user",
                    description: "User that is in this server",
                    type: 6,
                    required: false
                },
                {
                    name: "channel",
                    description: "Channel that is in this server",
                    type: 7,
                    required: false
                },
                {
                    name: "role",
                    description: "Role that is in this server",
                    type: 8,
                    required: false
                }                                                                                        
                                                                                                            
    
                ]            
        }
    });

    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "bots",
            description: "Manages my bots (and the api)",
            options: [
                {
                    name: "bot",
                    description: "The bot that you will be taking the action on",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            "name": "EternaBot",
                            "value": "EternaBot"
                        },
                        {
                            "name": "EternaAPI",
                            "value": "EternaAPI"
                        },
                        {
                            "name": "MarkBot",
                            "value": "MarkBot"
                        },
                        {
                            "name": "list",
                            "value": "list"
                        }                        
                    ]                  
                },                
                {
                    name: "action",
                    description: "The action to take on the bot",
                    type: 3,
                    required: false,
                    choices: [
                        {
                            "name": "start",
                            "value": "start"
                        },
                        {
                            "name": "stop",
                            "value": "stop"
                        },
                        {
                            "name": "restart",
                            "value": "restart"
                        },
                        {
                            "name": "pull",
                            "value": "pull"
                        }                        
                    ]                  
                }
            ]
        }
    });


    client.api.applications(client.user.id).guilds('274765646217216003').commands.post({
        data: {
            name: "embed",
            description: "Sends an embed",

            options: [
                {
                    name: "color",
                    description: "Color of the embed. Must use hex code!",
                    type: 3,
                    required: true
                    /*choices: [
                        {
                            "name": "Red",
                            "value": "#FF0000"
                        },
                        {
                            "name": "Blue",
                            "value": "#0000ff"
                        },
                        {
                            "name": "Purple",
                            "value": "#9932cc"
                        },
                        {
                            "name": "White",
                            "value": "#FFFFFF"
                        },
                        {
                            "name": "Black",
                            "value": "#000000"
                        },                                                                              
                        {
                            "name": "Green",
                            "value": "#00FF00"
                        }
                    ]*/                    
                },                
                {
                    name: "title",
                    description: "Title of the embed",
                    type: 3,
                    required: true
                },
                {
                    name: "content",
                    description: "Content of the embed",
                    type: 3,
                    required: true
                }
            ]
        }
    });



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

        if(command == 'bots') {
            const bot = args.find(arg => arg.name.toLowerCase() == "bot").value;
            var action = "";
            if(args.find(arg => arg.name.toLowerCase() == "action") !== undefined) {var action = args.find(arg => arg.name.toLowerCase() == "action")}
             
            var resp = "";

            if(bot == "list") {
                pm2.list((err, list) => {
                    for (i = 0; i < list.length; i++) { 
                        var resp = resp + list[i].name
                    }
                    console.log(resp)
                    
                  })
            }


            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: resp
                    }
                }
            });
        }

        if(command == 'shrug') {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "¯\\_(ツ)_/¯"
                    }
                }
            });
        }        

        

        if(command == 'discordver') {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                }
            });            

            const stable = await clientBuild.getClientBuildInfo(`stable`).then(data => {
                return "Stable " + data.buildNumber + " (" + data.buildID + ")"
            });  
            const PTB = await clientBuild.getClientBuildInfo(`PTB`).then(data => {
                return "PTB " + data.buildNumber + " (" + data.buildID + ")"
            });                                  
            const canary = await clientBuild.getClientBuildInfo(`canary`).then(data => {
                return "Canary " + data.buildNumber + " (" + data.buildID + ")"
            });

            const astable = await gplay.app({appId: 'com.discord'})
            .then(data => {
                return "Stable " + data.version 
            });  

            const istable = await store.app({id: 985746746}).then(data => {
                return "Stable " + data.version 
            }).catch(console.log);  
            
            const embed = new discord.MessageEmbed()
            .setTitle("Current Discord Builds")
            .setColor("00FF00")
            .addField("Desktop", stable + "\n" + PTB + "\n" + canary)
            .addField("iOS", istable)
            .addField("Android", astable)
            //.setFooter("Test", "https://cdn.discordapp.com/emojis/783706778290356284.gif")
            .setTimestamp();        
            client.api.channels(interaction.channel_id).messages.post({
            data: {
                content: null,
                tts: false,
                embed: embed
                }
            
        })




        }        

        if(command == 'checktf') {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                }
            });

            var l = "https://testflight.apple.com/join/gdE4pRzI"
    
            const html = await getHTML(l).then(({ url, html, stats, headers, statusCode })  => {return html})




            var title = getHtmlTitle({ html });        
            var title = title.slice(9);
            var title = title.replace(' beta - TestFlight - Apple','');
            
    
        if(html.includes("This beta is full.") == true) {
        
                const embed = new discord.MessageEmbed()
                .setTitle(title + " - TestFlight Status")
                .setURL(l)
                .setDescription("Discord testflight is full!")
                .setColor("FF0000")
                .setTimestamp();        
                client.api.channels(interaction.channel_id).messages.post({
                data: {
                    content: null,
                    tts: false,
                    embed: embed
                    }
                
            })
    

        } else {
    
    
                const embed = new discord.MessageEmbed()
                .setTitle(title + " - TestFlight Status")
                .setURL(l)
                .setDescription("Discord testflight has slots available!")
                .setColor("7fff01")
                .setTimestamp();        
                client.api.channels(interaction.channel_id).messages.post({
                data: {
                    content: null,
                    tts: false,
                    embed: embed
                    }
                
            })
    
    
    
    
          }            



        }        

        if(command == 'test') {


            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
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

        if(command == 'atol') {
            const hash = args.find(arg => arg.name.toLowerCase() == "hash").value;

            const res = await (async () => {
                try {
                    const t = await got.get('https://api.imgur.com/3/album/' + hash + '/images',{headers: {Authorization: config.imgur}}).json();
                    var a = [];
                    for (i = 0; i < t.data.length; i++) {
                        a.push(t.data[i].link)
                      }
                    return a;
                } catch (error) {
                    return "An error has occured please send the command again!";  
                }
            })();

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 5
                }
            });

            for (i = 0; i < res.length; i++) {
                          
            await client.api.channels(interaction.channel_id).messages.post({
                data: {
                    content: '<' + res[i] + '>',
                    tts: false               
                }
            });
          
        }
        client.api.channels(interaction.channel_id).messages.post({
            data: {
                content: 'Done!',
                tts: false               
            }
        });


        }      
        
      
        if(command == '8ball') {

            var res = ball();

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
        
        if(command == 'onlyme') {

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 3, 
                    data: {
                        flags: 64,
                        content: "You are the only one that can see this message!"
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



});



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
}}catch(err){
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

function getFromDataURL(u,f){
    fetch(u).then(a=>a.text().then(f));
}

client.login(require('./config.json').token);