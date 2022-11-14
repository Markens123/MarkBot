import apis from './apis/index.js';
import commands from './commands/index.js';
import interactions from './interactions/index.js'
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
import { AnApis, AnCommands, AnInteractions } from '../../../lib/interfaces/Rafts.js';
const module = fileURLToPath(import.meta.url);

/**
 * Anime commands raft for this boat.
 * @extends {BaseRaft}
 */
class Anime extends BaseRaft  {
  commands: AnCommands
  interactions: AnInteractions;
  apis: AnApis;
   
  launch() {
    super.launch({ commands, apis, interactions, module });
  }
}

export default Anime;
