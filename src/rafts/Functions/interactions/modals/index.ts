const modals: any = {};


modals.FUNCTIONS_ENV = (await import('./functions_env.js')).default;

export default modals;