import * as util from 'util';
import parse from 'parse-duration';
import { Collection, MessageButton, Message, Permissions } from 'discord.js';
import { getCodeblockMatch } from '../util/Constants.js';
import { BoatI } from '../../lib/interfaces/Main.js';
import { fileURLToPath } from 'url';
import BaseCommand from '../rafts/BaseCommand.js';
const __filename = fileURLToPath(import.meta.url);
var module = __filename;

export default async (boat: BoatI, message: Message) => {
  // Ignore bots
  if (message.author.bot) return;

  if (message.partial) {
    try {
      message.fetch()
    } catch(error)
    {
      boat.log.error('events/messageCreate', error)
    }
  }

  if (!message.content.startsWith(boat.prefix)) {
    handleRaft(boat.rafts, message);
    return;
  }

  let args: any = message.content.slice(boat.prefix.length).trim().split(/\s+/g);
  let ogargs = args;
  const command = args.shift().toLowerCase();

  let handler: undefined | BaseCommand = boat.commands.get(command) || boat.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

  if (!handler) {
    handleRaft(boat.rafts, message);
    return;
  }
  if (!message.channel.isText()) return;

  if (message.channel.type !== 'DM' && handler.dms === 'only') return message.channel.send('This command can only be used in dms!');
  if (message.channel.type === 'DM' && !handler.dms) return;

  if (!message.channel.isThread() && handler.threads === 'only') return message.channel.send('This command can only be used in threads!');
  if (message.channel.isThread() && !handler.threads) return;

  if (handler.permissions) {
    const authorPerms = message.member.permissions;
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
  let num: number;
  if (w === 'int' ||  w === 'integer') num = parseInt(thing);
  else if (w === 'float') num = parseFloat(thing);
  else if (num === NaN) return null
  else return num

  return thing;
}