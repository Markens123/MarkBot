import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import * as util from 'util';
import { fileURLToPath } from 'url';
var module = fileURLToPath(import.meta.url);

class PalworldStopInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'stop',
      enabled: true,
      dev: false,
      owner: true,
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    
    let stop = await this.boat.client.palworldApi.stop().catch((err) => err);

    if (stop !== true) return error(interaction, this.boat, stop)

    interaction.editReply({ content: "The server is stopping!" })
    this.boat.log.warn('palworld-stop', `${interaction.user.toString()} stopped the server`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.editReply({ content: "An error has occurred, please contact the bot owner if the issue persists." })
  boat.log.warn(module, `Error occurred during palworld stop: ${util.formatWithOptions({}, err)}`);
}

export default PalworldStopInteraction;