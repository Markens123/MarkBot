'use strict';

const util = require('util');

module.exports = async (boat, message) => {
  // Ignore bots
  if (message.author.bot) return;

  if (message.channel.type !== 'text') return;

  if (!message.content.startsWith(boat.prefix)) {
    handleRaft(boat.rafts, message);
    return;
  }

  const args = message.content.slice(boat.prefix.length).trim().split(/\s+/g);
  const command = args.shift().toLowerCase();

  const handler = boat.commands.get(command);
  if (!handler) {
    handleRaft(boat.rafts, message);
    return;
  }

  if (handler.owner && !boat.owners.includes(message.author.id)) return;

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
