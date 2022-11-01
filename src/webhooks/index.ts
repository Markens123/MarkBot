const hooks: any = {};

hooks.test = (await import('./testhook.js')).default;
hooks.tf = (await import('./testflight.js')).default;

export default hooks;
