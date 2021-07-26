const util = require('util');
let parse = require('parse-duration');
const { Collection, MessageButton } = require('discord.js');
const glob = require('glob');
const { getCodeblockMatch } = require('../util/Constants')

module.exports = async (boat, message) => {
  // Ignore bots
  if (message.author.bot) return;
  
  if (!message.content.startsWith(boat.prefix)) {
    let args = message.content.trim().split(/\s+/g);
    if (args.includes('--remind') || args.includes('-r')) {
      if (boat.owners.includes(message.author.id)) {
        const index = args.indexOf('--remind') > -1 ? args.indexOf('--remind') : args.indexOf('-r');
        let rtime = parse(args[index + 1], 'ms');
        args.splice(index, 2);
        if (rtime) {
          let yes = new MessageButton().setLabel('✅').setStyle('SUCCESS').setCustomId('collector:yes');
          let no = new MessageButton().setLabel('❌').setStyle('DANGER').setCustomId('collector:no');
          
          message.channel.send({ content: `Would you like me to remind you about that in ${getDur(rtime)}?`, components: [[yes, no]] }).then(async msg => {
            
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentInteractionCollector({ filter, idle: 15000 });

            collector.on('collect', async interaction => {
              
              if (interaction.customID === 'collector:no') {
                await interaction.reply({ content: 'The reminder was not set <:klukthumbsup:813679725917765662>', ephemeral: true });
                collector.stop();
              }
              if (interaction.customID === 'collector:yes') {
                await interaction.reply({ content: 'The reminder was successfully set', ephemeral: true })
                let resp = `**Reminder delivery:**\nTo: ${message.author.toString()}\nJump Link:\n${message.url}\nReminder:\n\`\`\`${args.join(' ')}\`\`\``
                collector.stop();
                setTimeout(()=>{
                  message.channel.send(resp)
                }, rtime)
              }
            });
            collector.on('end', collected => {
              msg.delete();
            });
          });
        }
      } 
    }

    handleRaft(boat.rafts, message);
    return;
  }

  let args = message.content.slice(boat.prefix.length).trim().split(/\s+/g);
  let ogargs = args;
  const command = args.shift().toLowerCase();

  let handler = boat.commands.get(command) || boat.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
  /*if (boat.client.overrides.has(message.author.id)) {
    const overrides = boat.client.overrides.get(message.author.id);
    const options = {
      cwd: `${__dirname}../../`,
      realpath: true
    }
    
    overrides.forEach(o => {
      if (boat.client.overrides.get(o)?.includes(command)) {
        let path = glob.sync(`overrides/${o}/${command}.js`, options)[0];
        if (path) {
          let cmd = require(path);
          handler = new cmd(boat.rafts['portAuthority']);
        }
      }
    });
  }*/
  
  if (!handler) {
    handleRaft(boat.rafts, message);
    return;
  }
  if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM' && !message.channel.type.includes('THREAD')) return;

  if (message.channel.type !== 'DM' && handler.dms === 'only') return message.channel.send('This command can only be used in dms!');
  if (message.channel.type === 'DM' && !handler.dms) return;

  if (!message.channel.type.includes('thread') && handler.threads === 'only') return message.channel.send('This command can only be used in threads!');
  if (message.channel.type.includes('thread') && !handler.threads) return;

  if (handler.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(handler.permissions)) {
        return message.reply("You don't have the required permissions for this command!");
    }
  }  
  // Cooldown stuff
  const { cooldowns } = boat.client;

  if (!cooldowns.has(handler.name)) {
    cooldowns.set(handler.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(handler.name);
  const cooldownAmount = (handler.cooldown || 0) * 1000;

  const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

  if (now < expirationTime) {
    const timeLeft = (expirationTime - now) / 1000;
    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${handler.name}\` command.`);
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  // End cooldown stuff 

  if (handler.owner && !boat.owners.includes(message.author.id)) return;

  if (handler.channels && !handler.channels.includes(message.channel.id)) return;
  if (handler.args) {
    let newargs = {};
    let count = 0
    for (let i = 0; i < handler.args.length; i++) {
      if (handler.args[i].type === 'flag') {
        if (args.includes(handler.args[i].flags[0]) || args.includes(handler.args[i].flags[1])) {
          let index = args.indexOf(handler.args[i].flags[0]) > -1 ? args.indexOf(handler.args[i].flags[0]) : args.indexOf(handler.args[i].flags[1]);
          newargs[handler.args[i].name] = handler.args[i].index === 0 ? true : args[index + handler.args[i].index];
          args.splice(index, handler.args[i].index+1);
        } else {
          newargs[handler.args[i].name] = handler.args[i].default ?? undefined;  
        }
      } else {
        newargs[handler.args[i].name] = parseArgs(args[count] ?? handler.args[i].default, handler.args[i].type);
        if (!newargs[handler.args[i].name] && handler.args[i].required) return message.channel.send(`The argument ${handler.args[i].name} is required!`);
        if (handler.args[i].match === 'codeblock') {
          let codeblock = getCodeblockMatch(message.content.slice(boat.prefix.length).replace('-nf', ' ').replace('--nofile', ' ').replace('-d', ' ').replace('--depth', ' ').trim()
          );
          newargs[handler.args[i].name] = codeblock;
        }
        if (newargs[handler.args[i].name] && handler.args[i].validation && !handler.args[i].validation({arg: newargs[handler.args[i].name], message, boat: handler.boat})) return message.channel.send(`The argument ${handler.args[i].name} has failed validation.`)
        count++
      }
    }
    args = newargs;
  }

  try {
    await handler.run(message, args, ogargs);
  } catch (err) {
    boat.log.warn(module, `Error occurred during command call ${handler.name}: ${util.formatWithOptions({}, err)}`);
  }
};

function handleRaft(rafts, message) {
  const raftNames = Object.keys(rafts);
  raftNames.forEach(raft => {
    if (rafts[raft].active && rafts[raft].messageListen) {
      rafts[raft].message(message);
    }
  });
}

function getDur(ms) {
  var date = new Date(ms);
  var str = [];
  if (date.getUTCDate()-1) str.push(`${date.getUTCDate()-1} ${date.getUTCDate()-1 > 1 ? 'days': 'day'}`);
  if (date.getUTCHours()) str.push(`${date.getUTCHours()} ${date.getUTCHours() > 1 ? 'hours': 'hour'}`);
  if (date.getUTCMinutes()) str.push(`${date.getUTCMinutes()} ${date.getUTCMinutes() > 1 ? 'minutes': 'minute'}`);
  if (date.getUTCSeconds()) str.push(`${date.getUTCSeconds()} ${date.getUTCSeconds() > 1 ? 'seconds': 'second'}`);
  if (date.getUTCMilliseconds()) str.push(`${date.getUTCMilliseconds()} millis`);
  return str.join(', ')
}

function parseArgs(thing, w) {
  if (w === 'int' ||  w === 'integer') return parseInt(thing);
  if (w === 'float') return parseFloat(thing);
  return thing;
}