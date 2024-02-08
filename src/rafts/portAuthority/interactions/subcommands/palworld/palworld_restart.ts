import { ChatInputCommandInteraction } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { exec } from 'child_process';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import * as util from 'util';

class PalworldRestartInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'restart',
      enabled: true, 
      roles: ['1204264340488982548', '816424700573646877'],
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    interaction.deferReply({ ephemeral: true })
    
    let { stdout, stderr } = await promiseExec('sudo docker restart palworld-server').catch((err): any => null);
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return error(interaction, this.boat, stderr);
    

    interaction.editReply({ content: "The server is rebooting!" })
    this.boat.log.warn('palworld-restart', `${interaction.user.toString()} restarted the server`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.editReply({ content: "An error has occurred, please contact the bot owner if the issue persists." })
  boat.log.warn(module, `Error occurred during palworld restart: ${util.formatWithOptions({}, err)}`);
}

function promiseExec(action): Promise<any> {
  return new Promise((resolve, reject) =>
    exec(action, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    }),
  );
}

function clean(text: string): string {
  if (typeof text === 'string') {
    return text.replace(/` /g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}

export default PalworldRestartInteraction;
