const menus: any = {};

menus.TASK_OPTIONS = (await import('./task_options.js')).default;
menus.ITEM_SELECT= (await import('./item_select.js')).default;

export default menus;