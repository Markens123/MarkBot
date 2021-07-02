'use strict';

class Util {
  constructor() {
    throw new Error('This class may not be instantiated');
  }

  /**
   * Iterate over a standard javascript object
   * @param {Object} obj the object to iterate over
   * @param {Function} func the function to call with each element, takes parameters (value, key, object)
   * @returns {Promise}
   */
  static objForEach(obj, func) {
    if (typeof obj === 'undefined') return Promise.resolve(undefined);
    const objKeys = Object.keys(obj);
    const promises = [];
    // Map each function call to a promises that resolves, whether the function is syncrhonous or not
    objKeys.forEach(key =>
      promises.push(
        new Promise(resolve => {
          async function handle() {
            await func(obj[key], key, obj);
          }
          resolve(handle());
        }),
      ),
    );
    // Return the full array promise in case the caller needs to ensure completion
    return Promise.all(promises);
  }
}

module.exports = Util;
