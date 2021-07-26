'use strict';

const events = {};

events.messageCreate = require('./messageCreate');
events.ready = require('./ready');
events.interactionCreate = require('./interactionCreate');

module.exports = events;
