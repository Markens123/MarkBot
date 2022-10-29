const buttons: any = {};

buttons.GENERATE_NEW = (await import('./generate_new.js')).default;

export default buttons;