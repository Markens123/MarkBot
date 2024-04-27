import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { awaitTimelimit } from '../../../../../util/Constants.js';

class MinecraftStatusInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'status',
      enabled: true,
      dev: false,
      guild: ['816098833054302208', '906198620813008896']
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const [status, color] = await awaitTimelimit(4000, this.boat.client.minecraftApi.running().catch((_) => false), false) ? ['Running', '#32CD32'] : ['Off', '#FF0000'];

    const uptime = await awaitTimelimit(4000, this.boat.client.minecraftApi.uptime(), 'None');

    const embed = new EmbedBuilder()
      .addFields(
        {
          name: "Status",
          value: status
        },
        {
          name: "Uptime",
          value: uptime
        }
      )
      .setColor(color as ColorResolvable)

    interaction.editReply({ embeds: [embed] })
  }
}

export default MinecraftStatusInteraction;