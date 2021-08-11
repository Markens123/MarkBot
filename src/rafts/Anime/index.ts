'use strict';

import apis from './apis/index.js';
import commands from './commands/index.js';
import interactions from './interactions/index.js'
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const module = fileURLToPath(import.meta.url);

/**
 * Anime commands raft for this boat.
 * @extends {BaseRaft}
 */
class Anime extends BaseRaft  {

  launch() {
    super.launch({ commands, apis, interactions, module });
  }
}

export default Anime;
