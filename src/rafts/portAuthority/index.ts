import commands from './commands/index.js';
import interactions from './interactions/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
import { PaCommands, PaInteractions } from '../../../lib/interfaces/Rafts.js';
const module = fileURLToPath(import.meta.url);

/**
 * The management raft for this boat.
 * @extends {BaseRaft}
 */
class PortAuthority extends BaseRaft {
  commands: PaCommands;
  interactions: PaInteractions;
  
  launch() {
    super.launch({ commands, interactions, module });
  }
}

export default PortAuthority;
