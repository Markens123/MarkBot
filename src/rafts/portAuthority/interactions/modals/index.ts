const modals: any = {};

modals.TEST = (await import('./testmodal.js')).default;

export default modals;
