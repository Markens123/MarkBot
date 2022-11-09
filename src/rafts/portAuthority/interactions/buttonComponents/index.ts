const buttons: any = {};

buttons.DELETE = (await import('./delete.js')).default;
buttons.TEST_BUTTONS = (await import('./test_buttons.js')).default;

export default buttons;
