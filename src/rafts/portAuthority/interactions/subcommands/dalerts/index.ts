const commands: any = {};

commands.set = (await import('./set.js')).default;
commands.config = (await import('./config.js')).default;
commands.role = (await import('./role.js')).default;

export default commands;
