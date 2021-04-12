'use strict';
var pm2 = require('pm2');
pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }  
});
const util = require('util');
const { exec } = require('child_process');
const Discord = require('discord.js');
const BaseInteraction = require('../../../BaseInteraction');

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
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction, args) {
    const client = this.boat.client;
    let bot = args?.find(arg => arg.name === `bot`)?.value;
    let action = args?.find(arg => arg.name === `action`)?.value;


    if(action == 'start') pm2.start(bot, (err, proc) => { return interaction.reply(`${bot} has been started!`) })
    else if(action == 'restart') pm2.restart(bot, (err, proc) => { return interaction.reply(`${bot} has been restarted!`) })
    else if(action == 'stop') pm2.stop(bot, (err, proc) => { return interaction.reply(`${bot} has been stopped!`) }) 

    else if(action == 'status') pm2.describe(bot, (err, processDescription) => { return interaction.reply(`${bot}'s status is ${processDescription[0].pm2_env.status}`) })

    else if(action == 'dump') pm2.describe(bot, async (err, processDescription) => {  
      let attachment = new Discord.MessageAttachment(Buffer.from(util.inspect(processDescription), 'utf-8'), 'dump.js');
      interaction.reply(`Loading file`);
      const apiMessage = Discord.APIMessage.create(interaction.webhook, null, attachment).resolveData();
      console.log(apiMessage.files)
      console.log(apiMessage.data)
      this.boat.client.api.webhooks(this.boat.client.user.id, interaction.token).messages('@original').patch({ data: apiMessage.data });
    });
    else if(action == 'pull') {
      await promiseExec(`pm2 pull ${bot}`).then(a => {return interaction.reply(`${bot} has been updated to the latest commit`)}).catch(err => { return interaction.reply(`\`\`\`bash\n${err}\`\`\``)});      
    }
  }
}

function promiseExec(action) {
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

module.exports = BotsInteraction;
