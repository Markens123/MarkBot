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
    
    if (type === 'command') {
      const cmd = this.boat.commands.get(thing);
      const cmdn = cmd.name;
      const raftn = rafts[cmd.raft.constructor.name];
      const raft = this.boat.rafts[raftn]

      const options = {
        cwd: `${__dirname}../../../`,
        realpath: true
      }
      let path = glob.sync(`**/commands/${cmdn}.js`, options)[0];

      try {
        const command = (await import(`file:///${path}?id=${Math.random().toString(36).substring(3)}`)).default;
         
        raft.commands.set(cmdn, new command(raft));
        
        this.boat.commands.set(cmdn, raft.commands.get(cmdn));
        
        interaction.reply({ content: `You have succesfully reloaded the command ${cmdn}`, ephemeral: true })
      } catch(error) {
        console.error(error);
        interaction.reply({ content: 'There was an error while reloading the command', ephemeral: true });
      }

    } 
  }
}

const rafts = {
  PortAuthority: 'portAuthority',
  Lighthouse: 'lighthouse',
  CaptainsLog: 'captainsLog',
  Anime: 'Anime',
}

function getDefinition() {
  const choices = [];
  const types = ['Raft', 'Interaction', 'Command', 'Interaction.Command', 'Interaction.Autocomplete', 'Interaction.Message', 'Interaction.User', 'Interaction.Button', 'Interaction.Select', 'Apis', 'Event']
  
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
