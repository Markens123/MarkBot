'use strict';

const commands: any = {};

commands.ceval = (await import('./ceval.js')).default;
commands.eval = (await import('./eval.js')).default;
commands.ping = (await import('./ping.js')).default;
commands.echo = (await import('./echo.js')).default;
commands.hello = (await import('./hello.js')).default;
commands.reboot = (await import('./reboot.js')).default;
commands.update = (await import('./update.js')).default;
commands.reloadcommand = (await import('./reloadcommand.js')).default;


export default commands;
