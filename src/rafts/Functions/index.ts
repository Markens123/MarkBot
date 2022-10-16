import interactions from './interactions/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * The functions management raft for this boat.
 * @extends {BaseRaft}
 */
class Functions extends BaseRaft {
  launch() {
    super.launch({ interactions, module });
  }
}

export default Functions;
