import { BoatI, RequestI } from '../../lib/interfaces/Main.js';
import { Response } from 'express';
/**
 * Represents a webhook
 * @abstract
 */
class BaseHook {
  active: boolean;
  name: string;
  gate: boolean;
  type: 'get' | 'put' | 'post' | 'patch' | 'delete';

  constructor(options) {
    /**
     * The name of this webhook
     * @name BaseHook#name
     * @type {string}
     */
    this.name = options.name;

    /**
     * Is the webhook active
     * @name BaseHook#active
     * @type {string}
     */
     this.active = options.active ?? true; 
     
    /**
     * Is the webhook gated
     * @name BaseHook#gate
     * @type {string}
     */
     this.gate = options.gate ?? false;

    /**
     * Type of request to recieve
     * @name BaseHook#type
     * @type {string}
     */
     this.type = options.type ?? 'get';         
  }
  /**
   * The code to run when webhook is called
   * @abstract
   */
  run(req: RequestI, resp: Response): any {
    throw new Error('Must be implemented by subclass');
  }
}

export default BaseHook;
