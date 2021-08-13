const messages: any = {};

messages.sauce = (await import('./sauce.js')).default;

export default messages;
