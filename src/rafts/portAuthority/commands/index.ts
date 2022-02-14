const commands: any = {};

commands.ceval = (await import('./ceval.js')).default;
commands.eval = (await import('./eval.js')).default;
commands.ping = (await import('./ping.js')).default;
commands.echo = (await import('./echo.js')).default;
commands.hello = (await import('./hello.js')).default;
commands.reboot = (await import('./reboot.js')).default;
commands.update = (await import('./update.js')).default;
commands.reloadcommand = (await import('./reloadcommand.js')).default;
commands.remind = (await import('./remind.js')).default;
commands.reminders = (await import('./reminders.js')).default;
commands.delreminder = (await import('./delreminder.js')).default;
commands.test = (await import('./test.js')).default;


export default commands;
