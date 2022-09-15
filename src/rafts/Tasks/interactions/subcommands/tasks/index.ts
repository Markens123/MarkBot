const commands: any = {};

commands.create = (await import('./create.js')).default;

export default commands;
