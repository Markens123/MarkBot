import commands from './commands/index.js';
import BaseRaft from '../BaseRaft.js';
import interactions from './interactions/index.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * The Schoology related stuff raft for this boat.
 * @extends {BaseRaft}
 */
class Schoology extends BaseRaft {
  launch() {
    super.launch({ commands, module, interactions });
  }
}

export default Schoology;
