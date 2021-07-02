'use strict';

const commands = require('./commands');
const interactions = require('./interactions');
const BaseRaft = require('../BaseRaft');

/**
 * The management raft for this boat.
 * @extends {BaseRaft}
 */
class PortAuthority extends BaseRaft {
  launch() {
    super.launch({ commands, interactions });
  }
}

module.exports = PortAuthority;
