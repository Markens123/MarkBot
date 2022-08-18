import { ChatInputCommandInteraction, CommandInteractionOption, EmbedBuilder, User } from 'discord.js';
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
      name: 'banner',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: CommandInteractionOption[]) {
    const client = this.boat.client;

    let user = args[0].value as string;

    let res = await client.users.fetch(user, {force: true}).then(myUser => myUser).catch(error => error) as User | Error;

    if (res instanceof Error) {
      return this.boat.log.error('commands/banner', res)
    }

    if (!res.banner) return interaction.reply({ content: 'That user does not have a banner!', ephemeral: true })

    let embed = new EmbedBuilder()
      .setTitle(`${res.tag}'s banner`)
      .setColor('NotQuiteBlack')
      .setImage(res.bannerURL({extension: 'png', size: 2048}));

    return interaction.reply({ embeds: [embed] });
  }
}

export default BannerInteraction;
