import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import * as util from 'util';
import { fileURLToPath } from 'url';
import { DateTime } from 'luxon';
var module = fileURLToPath(import.meta.url);
const delay = s => new Promise(res => setTimeout(res, s * 1000));

class PalworldRestartInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'restart',
      enabled: true,
      dev: false,
      roles: ['1204264340488982548', '816424700573646877'],
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    interaction.deferReply({ ephemeral: true })
    const instant = interaction.options.getBoolean('instantly') ?? false;
    
    if (!instant) {
      const date = DateTime.now().plus({ minutes: 1 }).toSeconds().toFixed()
      interaction.editReply({ content: `The server will restart in <t:${date}:R>` })
      await delay(60)
    }
    
    let restart = await this.boat.client.palworldApi.restart().catch((err) => err);

    if (restart !== true) return error(interaction, this.boat, restart);

    interaction.editReply({ content: "The server is rebooting!" })
    this.boat.log.warn('palworld-restart', `${interaction.user.toString()} restarted the server`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.editReply({ content: "An error has occurred, please contact the bot owner if the issue persists." })
  boat.log.warn(module, `Error occurred during palworld restart: ${util.formatWithOptions({}, err)}`);
}

export default PalworldRestartInteraction;