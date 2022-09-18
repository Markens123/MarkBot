const modals: any = {};

modals.TASK_CREATE = (await import('./task_create.js')).default;

export default modals;
