'use strict';
const Enmap = require("enmap");
const { Collection } = require('discord.js');

const databases = {};

databases.maldata = new Enmap('MALData');
databases.rdata = new Enmap('RData');
databases.cooldowns = new Collection();
databases.overrides = new Enmap('Overrides');

module.exports = databases;
