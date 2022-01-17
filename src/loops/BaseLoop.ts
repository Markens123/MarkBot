import { BoatI } from '../../lib/interfaces/Main.js';

/**
 * Represents a loop
 * @abstract
 */
class BaseLoop {
  active: boolean;
  boat: BoatI;
  name: string;
  time: number;
  id: NodeJS.Timer;
  interval: number;
  
  constructor(boat, options) {
    /**
     * The boat that handles this loop
     * @name BaseRaft#boat
     * @type {Boat}
     */
    Object.defineProperty(this, 'boat', { value: boat });
    
    /**
     * The name of this loop
     * @name BaseLoop#name
     * @type {string}
     */
     this.name = options.name;

    /**
     * The amount of time between each loop in seconds
     * @name BaseLoop#name
     * @type {string}
     */
     this.time = options.time;

    /**
     * Whether this loop is currently active
     * @type {boolean}
     */
    this.active = options.active ?? true;

    /**
     * The amount of times the loop has looped (only current iteration, starts at 0)
     * @type {boolean}
     */
     this.interval = 0;    
  }
  
  /**
   * Starts the loop
   * @abstract
   */
   start(): void {
    const id = setInterval(() => {
      if (this.active) {
        this.run()
        this.interval++
      }
    }, this.time * 1000);
    
    this.id = id;
    this.active = true;
    this.interval = 0;
  }

  /**
   * Stops the loop
   * @abstract
   */
   stop(): void {
    clearInterval(this.id);
    this.active = false;
    this.id = null;
    this.interval = 0;
  }  

  /**
   * The code to run every loop
   * @abstract
   */
   run(): any {
    throw new Error('Must be implemented by subclass');
  }
}

export default BaseLoop;
