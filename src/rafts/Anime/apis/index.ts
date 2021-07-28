'use strict';

const apis: any = {};

apis.oauth = (await import('./oauth.js')).default;

export default apis;