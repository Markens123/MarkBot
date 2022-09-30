import { BoatI } from '../../lib/interfaces/Main.js';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';


/**
 * Represents a loop
 * @abstract
 */
class BaseLoop {
  active: boolean;
  boat: BoatI;
  name: string;
  time: number | string | Date | DateTime;
  iterations: number;
  dev: boolean | 'only';
  job: CronJob;

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
     * The amount of time between each loop in seconds or as a date or cron job
     * @type {number|string|Date|DateTime}
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

    if (typeof this.time === 'number') {
      this.time = `*/${this.time} * * * * *`
    }

    this.active = true;
    if (this.job?.running) return null;
    if (this.job) {
      return this.job.start()
    }

    this.job = new CronJob(
      this.time,
      () => {
        if (this.active) {
          this.run()
          this.iterations++
        }
      },
      null,
      true,
    )
  }

  /**
   * Stops the loop
   * @abstract
   */
  stop(): void {
    this.job.stop();
    this.active = false;
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
