const commands: any = {};

commands.link = (await import('./link.js')).default;
commands.mal = (await import('./mal.js')).default;
commands.sauce = (await import('./sauce.js')).default;
commands.unlink = (await import('./unlink.js')).default;
commands.aqueue = (await import('./aqueue.js')).default;

export default commands;
