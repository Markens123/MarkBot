const events: any = {};

events.messageCreate = (await import('./messageCreate.js')).default;
events.ready = (await import('./ready.js')).default;
events.interactionCreate = (await import('./interactionCreate.js')).default;

export default events;
