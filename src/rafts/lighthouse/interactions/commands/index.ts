const commands: any = {};

commands.generate = (await import('./generate.js')).default;

export default commands;