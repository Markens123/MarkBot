const modals: any = {};

modals.TEST = (await import('./test.js')).default;

export default modals;
