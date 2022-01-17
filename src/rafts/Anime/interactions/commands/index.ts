const commands: any = {};

commands.halerts = (await import('./halerts.js')).default;

export default commands;
