import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import * as util from 'util';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import BaseInteraction from '../../../../BaseInteraction.js';

class PalworldRestartInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'backup',
      enabled: true,
      dev: false,
      roles: ['1204264340488982548', '816424700573646877'],
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    
    let backup = await this.boat.client.palworldApi.backup().catch((err) => {return err});

    if (backup !== true) return error(interaction, this.boat, backup);

    const embed = new EmbedBuilder()
    .setColor('#32CD32')
    .addFields([{name: 'Result', value: `\`\`\`bash\nBackup Created!\`\`\``}]);

    interaction.reply({ embeds: [embed] })
    this.boat.log.warn('palworld-backup', `${interaction.user.toString()} made a backup`)
  }
}

function error(interaction: ChatInputCommandInteraction, boat: BoatI, err: any) {
  interaction.reply({ content: "An error has occurred, please contact the bot owner if the issue persists.", ephemeral: true })
  boat.log.warn(module, `Error occurred during palworld backup: ${util.formatWithOptions({}, err)}`);
}

export default PalworldRestartInteraction;
