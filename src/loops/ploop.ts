import { TextChannel } from 'discord.js';
import { LoopOptions } from '../../lib/interfaces/Main.js';
import BaseLoop from './BaseLoop.js';
import { DateTime } from 'luxon';

class TLoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'pushloop',
      active: false,
      time: '0 15 * * *',
      dev: true
    };
    super(boat, options);
  }

  async run() {
    const boat = this.boat;
    const client = boat.client;
    const channel = await client.channels.fetch(boat.options.tokens.pushup) as TextChannel;
    type pdb = {
      message: string,
      due: number,
      done: number
    }

    //@ts-expect-error
    const values: pdb = Object.fromEntries(client.pushups.entries());
    client.dalerts
    
    const new_due = DateTime.now().setZone('America/New_York').ordinal + values.due;

    
    
    
    
    const dbstruct = {
      message: 'current embed msg id',
      due: 'num of pushups due',
      done: 'num of pushups done'
    }


  }
}

export default TLoop;
