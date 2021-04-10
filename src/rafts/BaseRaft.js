'use strict';

/**
 * Represents a raft that handles one function
 * @abstract
 */
class BaseRaft {
  constructor(boat) {
    /**
     * The boat that handles this raft
     * @name BaseRaft#boat
     * @type {Boat}
     */
    Object.defineProperty(this, 'boat', { value: boat });

    /**
     * Whether this raft is currently active
     * @type {boolean}
     */
    this.active = true;
  }

  /**
   * Initiates this raft
   * @abstract
   */
  launch() {
    throw new Error('Must be implemented by subclass');
  }
}

module.exports = BaseRaft;
