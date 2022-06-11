const loops: any = {};

loops.test = (await import('./hloop.js')).default;

export default loops;
