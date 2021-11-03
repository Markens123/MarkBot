const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;
interactions.autocomplete = (await import('./autocomplete/index.js')).default;

export default interactions;
