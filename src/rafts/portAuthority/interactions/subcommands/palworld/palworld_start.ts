import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import * as util from 'util';
import { fileURLToPath } from 'url';
var module = fileURLToPath(import.meta.url);

class PalworldStartInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'start',
      enabled: true,
      dev: false,
      roles: ['1204264340488982548', '816424700573646877'],
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    interaction.deferReply({ ephemeral: true })

    if (!this.boat.owners.includes(interaction.user.id)) return interaction.editReply({ content: "You don't have permission to use this command. Try restart instead." })
    
    let start = await this.boat.client.palworldApi.start().catch((err) => err);

    if (start !== true) return error(interaction, this.boat, start)

    interaction.editReply({ content: "The server is starting!" })
    this.boat.log.warn('palworld-start', `${interaction.user.toString()} started the server`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.editReply({ content: "An error has occurred, please contact the bot owner if the issue persists." })
  boat.log.warn(module, `Error occurred during palworld start: ${util.formatWithOptions({}, err)}`);
}

export default PalworldStartInteraction;