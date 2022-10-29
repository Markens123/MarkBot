const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;
interactions.subcommands = (await import('./subcommands/index.js')).default;
interactions.buttonComponents = (await import('./buttonComponents/index.js')).default;

export default interactions;