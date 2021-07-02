'use strict';

const apis = require('./apis');
const commands = require('./commands');
const BaseRaft = require('../BaseRaft');

/**
 * Anime commands raft for this boat.
 * @extends {BaseRaft}
 */
class Anime extends BaseRaft {
  launch() {
    super.launch({ commands, apis });
  }
}

module.exports = Anime;
