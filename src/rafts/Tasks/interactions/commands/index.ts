const commands: any = {};

commands.tasks = (await import('./tasks.js')).default;

export default commands;
