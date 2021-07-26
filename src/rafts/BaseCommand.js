'use strict';

/**
 * Represents a standard text command that can be run
 * @abstract
 */
class BaseCommand {
  constructor(raft, options) {
    /**
     * The boat that handles this commands raft
     * @name BaseCommand#boat
     * @type {boat}
     */
    Object.defineProperty(this, 'boat', { value: raft.boat });

    /**
     * The raft that handles this command
     * @name BaseCommand#raft
     * @type {Raft}
     */
    Object.defineProperty(this, 'raft', { value: raft });

    /**
     * The name of this command
     * @name BaseCommand#name
     * @type {string}
     */
    Object.defineProperty(this, 'name', { value: options.name });

    /**
     * Whether this command is currently enabled
     * @type {boolean}
     */
    this.enabled = options.enabled ?? true;

    /**
     * Whether this command is owners only
     * @type {boolean}
     */
    this.owner = options.owner ?? false;

    /**
     * Whether this command can be used in dms
     * @type {boolean|'only'}
     */
     this.dms = options.dms ?? false;

    /**
     * Whether this command can be used in threads
     * @type {boolean|'only'}
     */
     this.threads = options.threads ?? true;

    /**
     * Whether this command can be used in threads
     * @type {object[] | false}
     */
     this.args = options.args ?? false;
    
    if (!Array.isArray(this.args)) this.args = false;

    if (this.args) {
      for (let i = 0; i < this.args.length; i++) {
        if (!this.args[i].name) {
          this.args[i] = undefined;
          break;
        };
        if (!this.args[i].type) this.args[i].type = 'string';
        if (!this.args[i].required) this.args[i].required = false;
        if (this.args[i].type === 'flag') {
          if (!this.args[i].flags) this.args[i] = undefined;
          else {
            if (!this.args[i].index) this.args[i].index = 0; 
          }
        }
        if (this.args[i].match && this.args[i].match !== 'codeblock') this.args[i] = undefined;
      };
      this.args = this.args.filter(x => x !== undefined).sort((a, b) => (a.type !== 'flag') ? 1 : -1);

     } 
      



    /**
     * Which channels can use this command
     * @type {string[]}
     */
     this.channels = options.channels ?? false;
     
    /**
     * The aliases for this command
     * @type {string[]}
     */
     this.aliases = options.aliases ?? false;
     
    /**
     * The cooldown for this command
     * @type {int[]}
     */
     this.cooldown = options.cooldown ?? false;
     
    /**
     * The permission needed for this command
     * @type {string}
     */
     this.permissions = options.permissions ?? false;       
  }

  /**
   * Runs the command
   * @param {Message} message the message that executed the command
   * @param {string[]} args the content of the message split on spaces excluding the command name
   * @abstract
   */
  run() {
    throw new Error('Must be implemented by subclass');
  }
}

module.exports = BaseCommand;
