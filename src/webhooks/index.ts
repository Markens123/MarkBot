const hooks: any = {};

hooks.test = (await import('./test.js')).default;
hooks.tf = (await import('./testflight.js')).default;

export default hooks;
