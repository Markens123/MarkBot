import { ChatInputCommandInteraction } from 'discord.js';
import got from 'got';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'atol',
  description: 'Converts an imgur album link to direct media links',
  options: [
    {
        name: "hash",
        description: "The last string in the link",
        type: 3,
        required: true
    }
    ],  
};

class AtolInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'atol',
      guild: '274765646217216003',
      enabled: true,
      definition,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction, args: any) {
    let hash = args?.find(arg => arg.name === `hash`)?.value;

    const res = await (async () => {
      try {
          const t = await got.get('https://api.imgur.com/3/album/' + hash + '/images',{headers: {Authorization: process.env.IMGUR}}).json() as any;
          let a = [];
          for (let i = 0; i < t.data.length; i++) {
              a.push(t.data[i].link)
            }
          return `<${a.join(">\n<")}>`;
      } catch (error) {
          return "An error has occured please send the command again!";  
      }
  })();

    interaction.reply(`Generating links...`);
    interaction.editReply(res);
  }
}

export default AtolInteraction;
