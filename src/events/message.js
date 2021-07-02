'use strict';

const util = require('util');
var parse = require('parse-duration');
const { Collection } = require('discord.js');
const glob = require('glob');

const { MessageButton } = require('discord-buttons')

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
          let yes = new MessageButton().setLabel('✅').setStyle('green').setID('yes')
          let no = new MessageButton().setLabel('❌').setStyle('red').setID('no')
          message.channel.send(`Would you like me to remind you about that in ${getDur(rtime)}?`, {buttons: [yes, no]}).then(async msg => {
            const collector = msg.createButtonCollector(
              (button) => button.clicker.user.id === message.author.id,
              {time: 15000}
            )
            collector.on('collect', async b => {
              
              if (b.id === 'no') {
                await b.reply.send('The reminder was not set <:klukthumbsup:813679725917765662>', true);
                collector.stop();
              }
              if (b.id === 'yes') {
                await b.reply.send('The reminder was successfully set', true)
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

  const args = message.content.slice(boat.prefix.length).trim().split(/\s+/g);
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
  if (message.channel.type !== 'text' && message.channel.type !== 'dm') return;

  if (message.channel.type == 'text' && handler.dms === 'only') return message.channel.send('This command can only be used in dms!')
  if (message.channel.type == 'dm' && !handler.dms) return;

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

  try {
    await handler.run(message, args);
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