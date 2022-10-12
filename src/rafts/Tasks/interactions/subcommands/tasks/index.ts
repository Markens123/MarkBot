const commands: any = {};

commands.create = (await import('./tasks_create.js')).default;
commands.setup = (await import('./tasks_setup.js')).default;
commands.edit = (await import('./tasks_edit.js')).default;
commands.config = (await import('./tasks_config.js')).default;

export default commands;
