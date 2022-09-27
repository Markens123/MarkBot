const commands: any = {};

commands.halerts = (await import('./halerts.js')).default;
commands.mal = (await import('./mal.js')).default;

export default commands;
