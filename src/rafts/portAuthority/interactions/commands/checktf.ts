import BaseInteraction from '../../../BaseInteraction.js';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { checkTF } from '../../../../util/Constants.js';

const definition = {
  name: 'checktf',
  description: 'Checks the status of Discord TestFlight'
};

class CheckTFInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'checktf',
      guild: '274765646217216003',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction) {

    interaction.reply(`Checking TestFlight...`);
    let url = 'https://testflight.apple.com/join/gdE4pRzI'
    const { full, title } = await checkTF(url)

    let embed = new EmbedBuilder();
    embed.setTitle(title + " - TestFlight Status").setURL(url).setTimestamp();

    if (full) embed.setDescription("Discord testflight is full!").setColor('#FF0000');
    else embed.setDescription("Discord testflight has slots available!").setColor('#7fff01');

    interaction.editReply({ content: null, embeds: [embed] });
  }
}

export default CheckTFInteraction;
