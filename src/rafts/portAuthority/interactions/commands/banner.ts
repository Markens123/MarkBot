import { CommandInteraction, MessageEmbed } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'banner',
  description: 'Gets the banner of any user',
  options: [
    {
        name: "user",
        description: "User to get the banner from.",
        type: 6,
        required: true
    }
    ]  
};

class BannerInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'avatar',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction, args: any) {
    const client = this.boat.client;
    let user = args?.find(arg => arg.name === `user`)?.value;

    let res = await client.users.fetch(user, {force: true}).then(myUser => myUser).catch(error => error);

    if (!res.banner) return interaction.reply({ content: 'That user does not have a banner!', ephemeral: true })

    let embed = new MessageEmbed()
      .setTitle(`${res.tag}'s banner'`)
      .setColor('BLACK')
      .setImage(res.bannerURL({format: 'png' ,size: 256, dynamic: true}));

    return interaction.reply({ embeds: [embed] });
  }
}

export default BannerInteraction;
