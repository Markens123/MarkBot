const commands: any = {};

commands.create = (await import('./create.js')).default;
commands.setup = (await import('./setup.js')).default;
commands.edit = (await import('./edit.js')).default;

export default commands;
