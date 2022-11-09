import { AnySelectMenuInteraction, ChannelSelectMenuInteraction, CommandInteraction, Interaction, MentionableSelectMenuInteraction, MessageComponentInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from 'discord.js';
import BaseCommand from './BaseCommand.js';

class BaseInteraction extends BaseCommand {
  definition: any;
  commands: string[];
  subcommands: boolean;

  constructor(boat, options) {
    super(boat, options);

    this.owner = undefined;

    /**
     * The definition for this interaction that gets passed to discord to register / send it
     * @type {Object|Function?}
     */
    this.definition = options.definition;

    /**
     * The commands that autocomplete uses
     * @type {string[]}
     */
     this.commands = options.commands;

    /**
     * Does this command have subcommands
     * @type {boolean}
     */
     this.subcommands = options.subcommands;
  }

  /**
   * Runs the command
   * @name BaseInteraction#run
   * @param {Interaction} interaction the interaction that executed this call
   * @param {?Object} options the options passed to the interaction
   * @abstract
   */
   run(interaction: MessageComponentInteraction | AnySelectMenuInteraction | CommandInteraction | Interaction, options?: any): any {
    throw new Error('Must be implemented by subclass');
  }

}

export default BaseInteraction;
