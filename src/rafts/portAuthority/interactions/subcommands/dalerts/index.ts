const commands: any = {};

commands.set = (await import('./dalerts_set.js')).default;
commands.config = (await import('./dalerts_config.js')).default;
commands.role = (await import('./dalerts_role.js')).default;

export default commands;
