import { exec } from "child_process";
import { ExecuteOutput } from "../../lib/interfaces/Main";

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
  static objForEach(obj: object, func: any): Promise<any> {
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
  
  /**
   * Executes a function the specified number of times without blocking the event loop
   * @param {number} iterations the numebr of times to loop
   * @param {Function} func the function to execute each loop, takes parameters (currentIteration, args)
   * @param {Object} args args to pass to the function if required, if the function returns a value, args is set to that value after each run.
   * @param {boolean} args.break when set true, the for loop will break and resolve the promise with the rest of the returned object
   * @returns {Promise<*>}
   */
   static async nonBlockLoop<T>(iterations: number, func: (i: number, {}: T) => any, args: (T & { break?: boolean })): Promise<any> {
    let blockedSince = Date.now();

    // Handle unblocking if necessary
    async function unblock() {
      if (blockedSince + 15 > Date.now()) {
        await new Promise(resolve => setImmediate(resolve));
        blockedSince = Date.now();
      }
    }

    for (let i = 0; i < iterations; i++) {
      await unblock();
      const response = await func(i, args);
      if (response) {
        args = response;
      }
      if (args?.break === true) {
        delete args.break;
        break;
      }
    }
    return args;
  }

  /**
   * Promise version of child_process's exec function
   * @param {string} action the action to execute
   * @returns {Promise<ExecuteOutput>}
   */  
  static promiseExec(action: string): Promise<ExecuteOutput> {
    return new Promise((resolve, reject) =>
      exec(action, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }),
    );
  }
}

export { Util as util };

