const apis: any = {};

apis.oauth = (await import('./oauth.js')).default;
apis.list = (await import('./list.js')).default;

export default apis;