import BaseInteraction from '../../../BaseInteraction.js';
import { SlashCommandBuilder } from 'discord.js';

class ShopInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'shop',
      enabled: true,
      guild: '816098833054302208',
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run() {
    
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Opens shop menu for DnD')
    .addNumberOption(option =>
      option
        .setName('gold')
        .setMinValue(0.1)
        .setRequired(true)
    )
    .toJSON();
}

export default ShopInteraction;
