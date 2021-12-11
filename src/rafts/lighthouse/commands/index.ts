const commands: any = {};

commands.abstract = (await import('./abstract.js')).default;
commands.fractal = (await import('./fractal.js')).default;
commands.stars = (await import('./stars.js')).default;
commands.tree = (await import('./tree.js')).default;
commands.space = (await import('./space.js')).default;
commands.puppy = (await import('./puppy.js')).default;
commands.emoji = (await import('./emoji.js')).default;

export default commands;
