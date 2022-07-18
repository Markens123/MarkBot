import Discord, { CommandInteraction } from 'discord.js';
import pm2 from 'pm2';

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }  
});

import { exec } from 'child_process';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'bots',
  description: 'Manages my bots',
  options: [
    {
      name: 'bot',
      description: 'The bot that you will be taking the action on',
      type: 3,
      required: true,
      choices: [
        {
            'name': 'EternaBot',
            'value': 'EternaBot'
        },
        {
            'name': 'EternaAPI',
            'value': 'EternaAPI'
        },
        {
            'name': 'MarkBot',
            'value': 'MarkBot'
        },
        {
          'name': 'EthanBoatD',
          'value': 'EthanBoatD'
      }                              
      ]                  
    },                
    {
      name: 'action',
      description: 'The action to take on the bot',
      type: 3,
      required: true,
      choices: [
        {
          'name': 'start',
          'value': 'start'
        },
        {
          'name': 'stop',
          'value': 'stop'
        },
        {
          'name': 'restart',
          'value': 'restart'
        },
        {
          'name': 'status',
          'value': 'status'
        },
        {
          'name': 'dump',
          'value': 'dump'
        },
        {
          'name': 'pull',
          'value': 'pull'
        }                                                                        
      ]                  
    }
] 
};

class BotsInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'bots',
      guild: '274765646217216003',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction, args: any) {
    let bot = args?.find(arg => arg.name === `bot`)?.value;
    let action = args?.find(arg => arg.name === `action`)?.value;


    if(action == 'start') pm2.start(bot, () => { return interaction.reply(`${bot} has been started!`) })
    else if(action == 'restart') pm2.restart(bot, () => { return interaction.reply(`${bot} has been restarted!`) })
    else if(action == 'stop') pm2.stop(bot, () => { return interaction.reply(`${bot} has been stopped!`) }) 

    else if(action == 'status') pm2.describe(bot, (err, processDescription) => { return interaction.reply(`${bot}'s status is ${processDescription[0].pm2_env.status}`) })

    else if(action == 'dump') pm2.describe(bot, async (err, processDescription) => {  
      interaction.reply(`Loading file`);
      //@ts-ignore
      let attachment = new Discord.MessageAttachment(Buffer.from(processDescription, 'utf-8'), 'dump.json');
      interaction.editReply({content: null, files: [attachment]});
    });
    else if(action == 'pull') {
      await promiseExec(`pm2 pull ${bot}`).then(() => {return interaction.reply(`${bot} has been updated to the latest commit`)}).catch(err => { return interaction.reply(`\`\`\`bash\n${err}\`\`\``)});      
    }
  }
} 

function promiseExec(action: any): Promise<any> {
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

export default BotsInteraction;
