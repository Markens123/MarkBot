const buttons: any = {};

buttons.AQUEUE_ADD = (await import('./aqueue_add.js')).default;
buttons.AQUEUE_DELETE = (await import('./aqueue_delete.js')).default;
buttons.AQUEUE_REORDER = (await import('./aqueue_reorder.js')).default;
buttons.HALERTS_RESET = (await import('./halerts_reset.js')).default;

export default buttons;
