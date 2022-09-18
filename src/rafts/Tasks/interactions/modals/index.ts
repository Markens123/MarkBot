const modals: any = {};

modals.TASK_CREATE = (await import('./task_create.js')).default;
modals.TASK_EDIT = (await import('./task_edit.js')).default;

export default modals;
