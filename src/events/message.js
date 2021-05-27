'use strict';

const util = require('util');

const { Collection } = require('discord.js');

module.exports = async (boat, message) => {
  // Ignore bots
  if (message.author.bot) return;

  if (!message.content.startsWith(boat.prefix)) {
    handleRaft(boat.rafts, message);
    return;
  }

  const args = message.content.slice(boat.prefix.length).trim().split(/\s+/g);
  const command = args.shift().toLowerCase();

  const handler = boat.commands.get(command) || boat.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
  
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
