const commands: any = {};

commands.stars = (await import('./generate_stars.js')).default;
commands.abstract = (await import('./generate_abstract.js')).default;
commands.puppy = (await import('./generate_puppy.js')).default;
commands.fractal = (await import('./generate_fractal.js')).default;
commands.space = (await import('./generate_space.js')).default;
commands.tree = (await import('./generate_tree.js')).default;

export default commands;
