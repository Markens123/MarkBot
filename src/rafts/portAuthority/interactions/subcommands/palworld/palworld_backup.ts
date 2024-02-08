import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { exec } from 'child_process';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import * as util from 'util';

class PalworldRestartInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'backup',
      enabled: true, 
      roles: ['1204264340488982548', '816424700573646877'],
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    
    let { stdout, stderr } = await promiseExec('sudo docker exec palworld-server backup').catch((err): any => null);
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return error(interaction, this.boat, stderr);

    const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .addFields([{name: '📤 Output', value: `\`\`\`bash\n${stdout.slice(0, 1000)}\`\`\``}]);

    interaction.reply({ embeds: [embed] })
    this.boat.log.warn('palworld-backup', `${interaction.user.toString()} made a backup`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.reply({ content: "An error has occurred, please contact the bot owner if the issue persists.", ephemeral: true })
  boat.log.warn(module, `Error occurred during palworld backup: ${util.formatWithOptions({}, err)}`);
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
