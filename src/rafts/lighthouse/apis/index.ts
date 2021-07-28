'use strict';

const apis: any = {};

apis.nasa = (await import('./nasa.js')).default;
apis.dog = (await import('./dog.js')).default;

export default apis;
