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
  iterations: number;
  every: 'half-hour' | 'hour';
  lasthour: number;
  lastmin: number;
  dev: boolean | 'only';
  
  constructor(boat, options) {
    /**
     * The boat that handles this loop
     * @name BaseLoop#boat
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
     * @type {number}
     */
     this.time = options.time;

    /**
     * Whether this loop is currently active
     * @type {boolean}
     */
    this.active = options.active ?? true;

    /**
     * The amount of times the loop has looped (starts at 0)
     * @type {number}
     */
     this.iterations = 0;

    /**
     * The last hour the loop has ran (only used with every)
     * @type {number}
     */
     this.lasthour = 0;

    /**
     * The last minute the loop has ran (only used with every)
     * @type {number}
     */
     this.lastmin = 0;

    /**
     * When the loop should loop
     * @type {string}
     */
     this.every = options.every ?? undefined;

    /**
     * Whether this runs in dev (true by default)
     * @type {boolean|'none'}
     */
     this.dev = options.dev ?? true;
  }
  
  /**
   * Starts the loop
   * @abstract
   */
   start(): void {

    if (!this.dev && this.boat.options.dev) return;

    if (this.dev === 'only' && this.boat.options.dev == false) return;

    if (this.every) {
      const id = setInterval(() => {
        if (this.matchCheck()) {
          if (this.active) {
            this.run()
            this.iterations++
          }          
        }
      }, 10000);
      
      this.id = id;
      this.active = true;
      this.iterations = 0;
      this.lasthour = 0;
      return;
    } else {
      const id = setInterval(() => {
        if (this.active) {
          this.run()
          this.iterations++
        }
      }, this.time * 1000);
      
      this.id = id;
      this.active = true;
      this.iterations = 0;
    }
  }

  /**
   * Checks if the current time is the time to loop (only works for every)
   * @abstract
   */  
  matchCheck(): boolean {
    if (!this.every) return null;
    const d = new Date();
    if (this.every === 'hour' && d.getMinutes() === 0 && this.lasthour !== d.getHours()) {
      this.lasthour = d.getHours();
      return true;
    }
    else if (this.every === 'half-hour' && (d.getMinutes() === 0 || d.getMinutes() === 30)) {
      if ((d.getMinutes() === 0 && this.lasthour !== d.getHours()) || (d.getMinutes() === 30 && this.lastmin !== d.getMinutes())) {
        this.lasthour = d.getHours();
        this.lastmin = d.getMinutes();
        return true;
      }
    }
    return false;
  }

  /**
   * Stops the loop
   * @abstract
   */
   stop(): void {
    clearInterval(this.id);
    this.active = false;
    this.id = null;
    this.iterations = 0;
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
