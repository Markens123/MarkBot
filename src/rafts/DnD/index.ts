import interactions from './interactions/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * DnD raft for this boat.
 * @extends {BaseRaft}
 */
class DnD extends BaseRaft {
  launch() {
    super.launch({ interactions, module });
  }
}

export default DnD;
