'use strict';

import apis from './apis/index.js';
import commands from './commands/index.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * Image commands raft for this boat.
 * @extends {BaseRaft}
 */
class Lighthouse extends BaseRaft {
  launch() {
    super.launch({ commands, apis, module });
  }
}

export default Lighthouse;
