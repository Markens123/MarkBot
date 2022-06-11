import { CommandInteraction, Interaction, MessageComponentInteraction, SelectMenuInteraction, Snowflake } from 'discord.js';
import BaseCommand from './BaseCommand.js';

class BaseInteraction extends BaseCommand {
  guild?: Snowflake | Snowflake[];
  definition: any;
  commands: string[];

  constructor(boat, options) {
    super(boat, options);

    this.owner = undefined;

    /**
     * The guild, if any, that this interaction is specific too
     * @type {(Snowflake|Snowflake[])?}
     */
    this.guild = options.guild;

    /**
     * The definition for this interaction that gets passed to discord to register / send it
     * @type {Object|Function?}
     */
    this.definition = options.definition;

    /**
     * The definition for this interaction that gets passed to discord to register / send it
     * @type {string[]}
     */
     this.commands = options.commands;       
  }

  /**
   * Runs the command
   * @name BaseInteraction#run
   * @param {Interaction} interaction the interaction that executed this call
   * @param {?Object} options the options passed to the interaction
   * @abstract
   */
   run(interaction: MessageComponentInteraction | SelectMenuInteraction | CommandInteraction | Interaction, options?: any): any {
    throw new Error('Must be implemented by subclass');
  }

}

export default BaseInteraction;
