'use strict';

const apis = require('./apis');
const commands = require('./commands');
const BaseRaft = require('../BaseRaft');

/**
 * Image commands raft for this boat.
 * @extends {BaseRaft}
 */
class Lighthouse extends BaseRaft {
  launch() {
    super.launch({ commands, apis });
  }
}

module.exports = Lighthouse;
