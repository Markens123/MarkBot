import { AutocompleteInteraction } from 'discord.js';
import { range } from '../../../../util/Constants.js';
import BaseInteraction from '../../../BaseInteraction.js';

class DateInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'date',
      commands: ['timestamp']
    };
    super(raft, info);
  }

  async run(interaction: AutocompleteInteraction) {
    const client = this.boat.client;
    const cv = interaction.options.getFocused() as string;
    let arr: string[] = [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const days = ['1st', '2nd', '3rd', '4th', '5th', '6th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];
    const years = range(1900, 3000, 1).map(x => x.toString());

    if (!cv) {
      return interaction.respond(AtoResp(['Jan', 'Feb', 'Mar', 'Apr', 'May'], 5))
    } else {
      
      const parts = cv.split(' ');
      
      if (parts.length === 1) {
        arr = months.filter(x => x.toLowerCase().startsWith(cv.toLowerCase())).sort()
      }
      
      if (parts.length === 2) {
        if (months.includes(parts[0])) {
          arr = days.map(x => `${parts[0]} ${x}`).filter(x => x.toLowerCase().startsWith(cv.toLowerCase())).sort()
        }
      }
      
      if (parts.length === 3) {
        if (months.includes(parts[0])) { 
          if (days.includes(parts[1])) {
            arr = years.map(x => `${parts[0]} ${parts[1]} ${x}`).filter(x => x.toLowerCase().startsWith(cv.toLowerCase())).sort()
          }
        }
      }

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

export default DateInteraction;
