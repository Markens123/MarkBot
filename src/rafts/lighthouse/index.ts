import apis from './apis/index.js';
import commands from './commands/index.js';
import interactions from './interactions/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
import { LhApis, LhCommands, LhInteractions } from '../../../lib/interfaces/Rafts.js';
const module = fileURLToPath(import.meta.url);

/**
 * Image commands raft for this boat.
 * @extends {BaseRaft}
 */
class Lighthouse extends BaseRaft {
  commands: LhCommands;
  apis: LhApis;
  interactions: LhInteractions;
  
  launch() {
    super.launch({ commands, apis, module, interactions });
  }
}

export default Lighthouse;
