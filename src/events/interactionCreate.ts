import { ActionRow, ApplicationCommandType, ComponentType, Interaction, InteractionType, MessageActionRowComponent } from 'discord.js';
import { fileURLToPath } from 'url';
import * as util from 'util';
import { BoatI } from '../../lib/interfaces/Main.js';
import { ComponentFunctions, ModalFunctions } from '../util/Constants.js';
const module = fileURLToPath(import.meta.url);

export default async (boat: BoatI, interaction: Interaction) => {
  let handler;
  let name;
  // Check for handler
  if (
    interaction.type === InteractionType.ApplicationCommand 
    && interaction.commandType === ApplicationCommandType.ChatInput
  ) {
    handler = boat.interactions.commands.get(interaction.commandName)
    if (handler.subcommands) {
      let scname = interaction.options.getSubcommand(false); 
      if (scname) {
       handler = boat.interactions.subcommands.get(interaction.commandName).get(scname)
      }
    }
  }

  if (interaction.type === InteractionType.ModalSubmit) {
    name = ModalFunctions[Number(interaction.customId.split(':')[0])];

    handler = boat.interactions.modals.get(name);
  }

  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    name = boat.interactions.autocomplete
      .filter(i => i.name === interaction.options.getFocused(true).name)
      .map(i => i.commands.includes(interaction.commandName) ? i.name : null)
      .filter(x => x !== null)[0];
    handler = boat.interactions.autocomplete.get(name);
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    switch (interaction.commandType) {
      case ApplicationCommandType.Message:
        handler = boat.interactions.messageContextMenuComponents.get(interaction.commandName.toLowerCase());
        break;
      case ApplicationCommandType.User:
        handler = boat.interactions.userContextMenuComponents.get(interaction.commandName.toLowerCase());
        break;
    }
  }

  if (interaction.type === InteractionType.MessageComponent) {
    if (!verifyCustomId(interaction.customId, interaction.message.components)) {
      interaction.reply({content: 'You think you are sneaky huh, well, no such luck here!', ephemeral: true });
      return;
    }
    name = ComponentFunctions[Number(interaction.customId.split(':')[0])];
    switch (interaction.componentType) {
      case ComponentType.Button:
        handler = boat.interactions.buttonComponents.get(name);
        break;
      case ComponentType.SelectMenu:
        handler = boat.interactions.selectMenuComponents.get(name);
        break;
    }
  }

  if (!handler || !handler.enabled) {
    //@ts-expect-error
    if (interaction.customId?.split(':')[0] === 'collector') return;
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return;

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

function verifyCustomId(id: string, components: ActionRow<MessageActionRowComponent>[]) {
  if (!components?.length) return true;
  const found = components.find(component => component.type === ComponentType.ActionRow && component.components.find(c => c.customId === id));
  if (found) return true;
  return false;
}
