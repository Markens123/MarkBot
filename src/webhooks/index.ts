const hooks: any = {};

hooks.test = (await import('./test.js')).default;

export default hooks;
