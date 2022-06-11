import {  MessageComponentInteraction } from 'discord.js';
import * as util from 'util';
import { BoatI } from '../../lib/interfaces/Main.js';
import { ComponentFunctions, ModalFunctions } from '../util/Constants.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

export default async (boat: BoatI, interaction: MessageComponentInteraction) => {
  let handler;
  let name;
  // Check for handler
  if (interaction.isCommand()) {
    handler = boat.interactions.commands.get(interaction.commandName);
  }

  if (interaction.isModalSubmit()) {
    name = ModalFunctions[Number(interaction.customId.split(':')[0])];

    handler = boat.interactions.modals.get(name);
  }

  if (interaction.isAutocomplete()) {
    name = boat.interactions.autocomplete.map(i => i.commands.includes(interaction.commandName) ? i.name : null).filter(x => x !== null)[0];
    handler = boat.interactions.autocomplete.get(name);
  }

  if (interaction.isContextMenu()) {
    switch (interaction.targetType) {
      case 'MESSAGE':
        handler = boat.interactions.messageContextMenuComponents.get(interaction.commandName.toLowerCase());
        break;
      case 'USER':
        handler = boat.interactions.userContextMenuComponents.get(interaction.commandName.toLowerCase());
        break;
    }
  }

  if (interaction.isMessageComponent()) {
    if (!verifyCustomId(interaction.customId, interaction.message.components)) {
      interaction.reply({content: 'You think you are sneaky huh, well, no such luck here!', ephemeral: true });
      return;
    }
    name = ComponentFunctions[Number(interaction.customId.split(':')[0])];
    switch (interaction.componentType) {
      case 'BUTTON':
        handler = boat.interactions.buttonComponents.get(name);
        break;
      case 'SELECT_MENU':
        handler = boat.interactions.selectMenuComponents.get(name);
        break;
    }
  }

  if (!handler || !handler.enabled) {
    if (interaction.customId?.split(':')[0] === 'collector') return;
    if (interaction.isAutocomplete()) return;

    interaction.reply({ content: 'This command has no associated action (or is disabled)! Please contact the developer if it is supposed to be doing something!', ephemeral: true });
    return;
  }

  if (!handler.dev && boat.options.dev) return;

  if (handler.dev === 'only' && boat.options.dev == false) return;

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
