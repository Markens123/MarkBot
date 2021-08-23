import commands from './commands/index.js';
import interactions from './interactions/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * The management raft for this boat.
 * @extends {BaseRaft}
 */
class PortAuthority extends BaseRaft {
  launch() {
    super.launch({ commands, interactions, module });
  }
}

export default PortAuthority;
