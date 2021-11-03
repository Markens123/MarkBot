import { AutocompleteInteraction } from 'discord.js';
import { BoatI } from '../../../../../lib/interfaces/Main.js';
import messageCreate from '../../../../events/messageCreate.js';
import BaseInteraction from '../../../BaseInteraction.js';

class aReloadInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'reload',
    };
    super(raft, info);
  }

  async run(interaction: AutocompleteInteraction) {
    const client = this.boat.client;
    const cv = interaction.options.getFocused() as string;
    let arr: string[];
  
    switch(interaction.options.getString('type')) {
      case 'command':
        arr = Array.from(this.boat.commands.keys());
        break;
      case 'apis':
        let a = [];
        const keys = Object.keys(this.boat.rafts);
        keys.forEach(x => {
          if (this.boat.rafts[x].apis) Object.keys(this.boat.rafts[x].apis).forEach(x => a.push(x)) 
        }); 
        arr = a;
      case 'raft': 
        arr = Object.keys(this.boat.rafts);
        break;
      case 'interaction.command':
        arr = Array.from(this.boat.interactions.commands.keys());
        break;
      case 'interaction.autocomplete':
        arr = Array.from(this.boat.interactions.autocomplete.keys());
        break;

    }

    if (!cv) {
      return interaction.respond(AtoResp(arr, 5))
    } else {
      arr = arr.filter(x => x.toLowerCase().startsWith(cv.toLowerCase())).sort();

      if (!arr.length) return;

      interaction.respond(AtoResp(arr, 5));

    }    
  }
}

function AtoResp(arr: any[], count = 0) {
  let ret = []; 
  if (count) arr = arr.slice(0, count);
  arr.forEach(e => {
    ret.push({
      name: e,
      value: e
    })
  });
  return ret;
}

function getraftfromcmd(boat: BoatI, cmd: string) {
  const keys = Object.keys(boat.rafts);
  keys.forEach(x => {
    boat.rafts[x].commands.some(x => x.name == cmd)
  });
}


export default aReloadInteraction;
