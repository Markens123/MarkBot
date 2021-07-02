'use strict';

const events = {};

events.message = require('./message');
events.ready = require('./ready');
events.interaction = require('./interaction');

module.exports = events;
