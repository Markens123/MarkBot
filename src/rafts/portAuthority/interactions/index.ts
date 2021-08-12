'use strict';

const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;

export default interactions;
