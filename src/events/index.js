'use strict';

const events = {};

events.message = require('./message');
events.ready = require('./ready');
events.interactionCreate = require('./interactionCreate');

module.exports = events;
