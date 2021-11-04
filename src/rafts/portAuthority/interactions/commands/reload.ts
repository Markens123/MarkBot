import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReloadInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'reload',
      guild: '816098833054302208',
      enabled: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: CommandInteraction) {
    const client = this.boat.client;
    const type = interaction.options.getString('type').toLowerCase();
    const thing = interaction.options.getString('thing').toLowerCase();
    const options = {
      cwd: `${__dirname}../../../`,
      realpath: true
    };    
    let path: string;
    let raft: string;
    let t: string;
    let tn: string;

    switch(type) {
      case 'command':
        t = this.boat.commands.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/commands/${tn}.js`, options)[0];
        break;
      case 'interaction.command':
        t = this.boat.interactions.commands.get(thing)
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/commands/${tn}.js`, options)[0];
        break;
    } 


    if (type === 'command') {
      try {
        const command = (await import(`file:///${path}?id=${Math.random().toString(36).substring(3)}`)).default;
         
        raft.commands.set(cmdn, new command(raft));
        
        this.boat.commands.set(tn, raft.commands.get(tn));
        
        interaction.reply({ content: `You have succesfully reloaded the command ${tn}`, ephemeral: true })
      } catch(error) {
        this.boat.log.error(__filename ,error);
        interaction.reply({ content: 'There was an error while reloading the command', ephemeral: true });
      }
    }

    if (type === 'interaction.command') {
      try {
        const command = (await import(`file:///${path}?id=${Math.random().toString(36).substring(3)}`)).default;
         
        raft.interactions.commands.set(cmdn, new command(raft));
        
        this.boat.interactions.commands.set(tn, raft.interactions.commands.get(tn));
        
        interaction.reply({ content: `You have succesfully reloaded the slash command ${tn}`, ephemeral: true })
      } catch(error) {
        this.boat.log.error(__filename ,error);
        interaction.reply({ content: 'There was an error while reloading the command', ephemeral: true });
      }
    }
  }
}

function getDefinition() {
  const choices = [];
  const types = ['Command', 'Interaction.Command', 'Interaction.Autocomplete', 'Interaction.Message', 'Interaction.User', 'Interaction.Button', 'Interaction.Select', 'Api', 'Event']
  
  for (let i = 0; i < types.length; i++) {
    choices.push({
      name: types[i],
      value: types[i].toLowerCase()
    })  
  }
  
  return {
    name: 'reload',
    description: 'Reloads certian bot things',
    options: [
      {
          name: 'type',
          description: 'The type of thing to reload',
          type: 3,
          choices,
          required: true
      },
      {
        name: 'thing',
        description: 'The thing to reload',
        type: 3,
        autocomplete: true,
        required: true
      }
      ]  
  }
}

export default ReloadInteraction;
