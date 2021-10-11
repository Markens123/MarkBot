const commands: any = {};

commands.test = (await import('./test.js')).default;

export default commands;
