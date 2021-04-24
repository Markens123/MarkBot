'use strict';

const { Collection } = require('discord.js');
const apis = require('./apis');
const commands = require('./commands');
const util = require('../../util');
const BaseRaft = require('../BaseRaft');

/**
 * Image commands raft for this boat.
 * @extends {BaseRaft}
 */
class Lighthouse extends BaseRaft {
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

module.exports = Lighthouse;
