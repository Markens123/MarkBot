const commands: any = {};

commands.mylist = (await import('./mal_mylist.js')).default;
commands.get = (await import('./mal_get.js')).default;
commands.search = (await import('./mal_search.js')).default;
commands.link = (await import('./mal_link.js')).default;
commands.unlink = (await import('./mal_unlink.js')).default;

export default commands;
