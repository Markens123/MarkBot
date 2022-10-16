const commands: any = {};

commands.functions = (await import('./functions.js')).default;

export default commands;