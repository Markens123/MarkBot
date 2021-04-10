'use strict';

const BaseCommand = require('./BaseCommand');

const InteractionTypes = {
  APPLICATION_COMMAND: 2,
};

class BaseInteraction extends BaseCommand {
  constructor(boat, options) {
    super(boat, options);

    this.owner = undefined;

    /**
     * The guild, if any, that this interaction is specific too
     * @type {(Snowflake|Snowflake[])?}
     */
    this.guild = options.guild;

    /**
     * The type of interaction that this handler is expecting
     * @type {Number}
     */
    this.type = options.type;

    /**
     * The definition for this interaction that gets passed to discord to register it
     * @type {Object?}
     */
    this.definition = options.definition;
  }

  /**
   * Runs the command
   * @name BaseInteraction#run
   * @param {Interaction} interaction the interaction that executed this call
   * @param {?Object} options the options passed to the interaction
   * @abstract
   */
}

module.exports = BaseInteraction;
module.exports.InteractionTypes = InteractionTypes;
