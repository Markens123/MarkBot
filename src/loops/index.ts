const loops: any = {};

loops.test = (await import('./test.js')).default;

export default loops;
