'use strict';

import {  Interaction } from 'discord.js';
import * as util from 'util';
import { BoatI } from '../../lib/interfaces/Main.js';
import { ComponentFunctions } from '../util/Constants.js';

export default async (boat: BoatI, interaction: Interaction) => {
  let handler;
  // Check for handler
  if (interaction.isCommand()) {
    handler = boat.interactions.commands.get(interaction.commandName);
  }
  if (interaction.isContextMenu()) {
    switch (interaction.command.type) {
      case 'MESSAGE':
        handler = boat.interactions.messageContextMenuComponents.get(interaction.commandName);
        break;
      case 'USER':
        handler = boat.interactions.userContextMenuComponents.get(interaction.commandName);
        break;

    }
  }
  if (interaction.isMessageComponent()) {
    if (!verifyCustomId(interaction.customId, interaction.message.components)) {
      interaction.reply({content: 'You think you are sneaky huh, well, no such luck here!', ephemeral: true });
      return;
    }
    const name = ComponentFunctions[Number(interaction.customId.split(':')[0])];
    switch (interaction.componentType) {
      case 'BUTTON':
        handler = boat.interactions.buttonComponents.get(name);
        break;
      case 'SELECT_MENU':
        handler = boat.interactions.selectMenuComponents.get(name);
        break;
    }
  }
  if (!handler) {
    //@ts-expect-error
    if (interaction.customId.split(':')[0] === 'collector') return;
    //@ts-expect-error
    interaction.reply({ content: 'This command has no associated action! Please contact the developer if it is supposed to be doing something!', ephemeral: true });
    return;
  }

  // Handle command
  try {
    //@ts-ignore
    await handler.run(interaction, interaction.options?.data);
  } catch (err) {
    boat.log.warn(module, `Error occurred during interaction call ${handler.name}: ${util.formatWithOptions({}, err)}`);
  }
};

function verifyCustomId(id, components) {
  if (!components?.length) return true;
  const found = components.find(component => component.type === 'ACTION_ROW' && component.components.find(c => c.customId === id));
  if (found) return true;
  return false;
}