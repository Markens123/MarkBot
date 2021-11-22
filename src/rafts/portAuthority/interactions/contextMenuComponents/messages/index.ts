const messages: any = {};

messages.sauce = (await import('./guess.js')).default;

export default messages;
