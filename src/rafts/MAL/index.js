'use strict';

const { Collection } = require('discord.js');
const commands = require('./commands');
const apis = require('./apis');
const util = require('../../util');
const BaseRaft = require('../BaseRaft');

/**
 * The management raft for this boat.
 * @extends {BaseRaft}
 */
class MAL extends BaseRaft {
  constructor(boat) {
    super(boat);
    /**
     * The commands for this raft
     * @type {Collection<string, Object>}
     */
    this.commands = new Collection();

    /**
     * The apis for this raft
     * @type {Object}
     */
     this.apis = {};

  }

  launch() {
    this.boat.log.verbose(module, `Lauching ${this.constructor.name}`);
    this.boat.log.verbose(module, 'Registering commands');
    util.objForEach(commands, ((command, name) => this.commands.set(name, new command(this))).bind(this));
    util.objForEach(apis, ((api, name) => (this.apis[name] = new api(this))).bind(this));

  }
}

module.exports = MAL;
