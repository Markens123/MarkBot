const commands: any = {};

commands.mylist = (await import('./mylist.js')).default;
commands.get = (await import('./get.js')).default;
commands.search = (await import('./search.js')).default;
commands.link = (await import('./link.js')).default;
commands.unlink = (await import('./unlink.js')).default;

export default commands;
