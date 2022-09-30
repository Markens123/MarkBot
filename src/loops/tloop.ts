import { LoopOptions } from '../../lib/interfaces/Main.js';
import BaseLoop from './BaseLoop.js';

class TLoop extends BaseLoop {
  constructor(boat) {
    const options: LoopOptions = {
      name: 'testloop',
      active: false,
      time: 2,
    };
    super(boat, options);
  }

  async run() {
    console.log(`ran ${this.iterations}`)
  }
}

export default TLoop;
