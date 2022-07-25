const commands: any = {};

commands['8ball'] = (await import('./8ball.js')).default;
commands.atol = (await import('./atol.js')).default;
commands.avatar = (await import('./avatar.js')).default;
commands.checktf = (await import('./checktf.js')).default;
commands.discordver = (await import('./discordver.js')).default;
commands.shrug = (await import('./shrug.js')).default;
commands.test = (await import('./test.js')).default;
commands.noresp = (await import('./noresp.js')).default;
commands.onlyme = (await import('./onlyme.js')).default;
commands.ephemeral = (await import('./ephemeral.js')).default;
commands.schedule = (await import('./schedule.js')).default;
commands.reload = (await import('./reload.js')).default;
commands.banner = (await import('./banner.js')).default;
commands.enable = (await import('./enable.js')).default;
commands.disable = (await import('./disable.js')).default;

export default commands;
