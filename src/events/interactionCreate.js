'use strict';

const util = require('util');

module.exports = async (boat, interaction) => {
  let handler;
  // Check for handler
  switch (interaction.type) {
    case 2:
      handler = boat.interactions.commands.get(interaction.commandName);
  }

  if (!handler) {
    interaction.reply('This command has no associated action! Please contact the developer if it is supposed to be doing something!', { ephemeral: true });
    return;
  }

  // Handle command
  try {
    await handler.run(interaction, interaction.options);
  } catch (err) {
    boat.log.warn(module, `Error occurred during interaction call ${handler.name}: ${util.formatWithOptions({}, err)}`);
  }
};
