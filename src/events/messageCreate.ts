import { ChannelType, Collection, Message } from 'discord.js';
import { fileURLToPath } from 'url';
import * as util from 'util';
import { ArgI, BoatI } from '../../lib/interfaces/Main.js';
import BaseCommand from '../rafts/BaseCommand.js';
import { getCodeblockMatch } from '../util/Constants.js';
const __filename = fileURLToPath(import.meta.url);
var module = __filename;

export default async (boat: BoatI, message: Message) => {
  // Ignore bots
  if (message.author.bot) return;

  if (message.partial) {
    try {
      message.fetch()
    } catch (error) {
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

  if (!message.channel.isTextBased()) return;

  if (!handler.enabled) return;

  if (message.channel.type !== ChannelType.DM && handler.dms === 'only') return message.channel.send('This command can only be used in dms!');
  if (message.channel.type === ChannelType.DM && !handler.dms) return;

  if (!message.channel.isThread() && handler.threads === 'only') return message.channel.send('This command can only be used in threads!');
  if (message.channel.isThread() && !handler.threads) return;

  if (!(message.channel.type === ChannelType.GuildVoice) && handler.voice === 'only') return message.channel.send('This command can only be used in voice channels!');
  if (message.channel.type === ChannelType.GuildVoice && !handler.voice) return;

  if (handler.permissions) {
    const authorPerms = message.member.permissions;
    if (!authorPerms || !authorPerms.has(handler.permissions)) {
      return message.reply("You don't have the required permissions for this command!");
    }
  }

  if (handler.roles) {
    const authorRoles = message.member.roles.cache.map(x => x.id)
    if (!handler.roles.some(x => authorRoles.includes(x))) {
      return message.reply("You don't have the required permissions for this command!");
    }
  }

  if (handler.owner && !boat.owners.includes(message.author.id)) return;

  if (handler.channels && !handler.channels.includes(message.channel.id)) return;

  if (handler.guild) {
    if (typeof handler.guild === 'string') {
      if (message.guild.id !== handler.guild) return;
    }
    else if (!handler.guild.includes(message.guild.id)) return;
  }

  if (!handler.dev && boat.options.dev) return;

  if (handler.dev === 'only' && boat.options.dev == false) return;

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


  if (handler.args) {
    let newargs = {};
    let count = 0
    for (let i = 0; i < handler.args.length; i++) {
      if (handler.args[i].type === 'flag') {

        const f1 = new RegExp(`(?<=\\s|^|\\W)${handler.args[i].flags[0]}(?=\s|$|\\W)`, 'i');
        const f2 = new RegExp(`(?<=\\s|^|\\W)${handler.args[i].flags[1]}(?=\s|$|\\W)`, 'i');

        if (f1.test(args) || f2.test(args)) {
          let index = args.search(f1) > -1 ? args.search(f1) : args.search(f2);
          newargs[handler.args[i].name] = handler.args[i].index === 0 ? true : args.splice(index + 1, handler.args[i].index + 1).join(' ');
        } else {
          newargs[handler.args[i].name] = handler.args[i].default ?? undefined;
        }
      } else if (handler.args[i].match === 'codeblock') {
        let codeblock = getCodeblockMatch(removeFlags(message.content.slice(boat.prefix.length).split(' '), handler.args).join(' '));
        newargs[handler.args[i].name] = codeblock;
      } else if (handler.args[i].type === 'msg') {
        newargs[handler.args[i].name] = removeFlags(ogargs, handler.args);
      } else {
        if (handler.args[i].index) {
          newargs[handler.args[i].name] = args.slice(count, handler.args[i].index + 1).join(' ')
        } else newargs[handler.args[i].name] = parseArgs(args[count] ?? handler.args[i].default, handler.args[i].type);

        if (!newargs[handler.args[i].name] && handler.args[i].required) return message.channel.send(handler.args[i].error ?? `The argument ${handler.args[i].name} is required!`);
        if (newargs[handler.args[i].name] && handler.args[i].validation && !handler.args[i].validation({ arg: newargs[handler.args[i].name], message, boat: handler.boat })) return message.channel.send(handler.args[i].error ?? `The argument ${handler.args[i].name} has failed validation.`)
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

function parseArgs(thing, w) {
  let num: number;
  if (w === 'int' || w === 'integer') num = parseInt(thing);
  else if (w === 'float') num = parseFloat(thing);
  else if (Number.isNaN(num)) return null

  return num ?? thing;
}

function removeFlags(msg: string[], args: ArgI[]) {
  args = args.filter(x => x.type === 'flag');
  const flags = new Set(args.map(x => x.flags).flat()) as Set<string>;

  const newArr = msg.filter(x => !flags.has(x));

  return newArr;
}
