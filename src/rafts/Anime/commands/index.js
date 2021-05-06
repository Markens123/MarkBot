'use strict';

const commands = {};

commands.link = require('./link');
commands.mal = require('./mal');
commands.sauce = require('./sauce');
commands.animealerts = require('./animealerts');

module.exports = commands;
