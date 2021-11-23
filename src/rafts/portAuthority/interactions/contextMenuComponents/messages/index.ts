const messages: any = {};

messages.guess = (await import('./guess.js')).default;

export default messages;
