'use strict';

const commands = {};

commands.ceval = require('./ceval');
commands.eval = require('./eval');
commands.ping = require('./ping');
commands.echo = require('./echo');
commands.hello = require('./hello');
commands.reboot = require('./reboot');
commands.update = require('./update');
commands.experimentcheck = require('./experimentcheck');
commands.reloadcommand = require('./reloadcommand');

module.exports = commands;
