// Import dependencies
import { Client, Collection, Snowflake } from 'discord.js';
import events from './events/index.js';
import rafts from './rafts/index.js';
import BaseRaft from './rafts/BaseRaft.js';
import logBuilder from './rafts/captainsLog/LogRouter.js';
import { util } from './util/index.js';
import databases from './databases.js';
import { BoatI, BoatOptions, ClientI } from '../lib/interfaces/Main.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var module = __filename;

/**
 * The main entry point for any instance of this bot.
 */
class Boat implements BoatI {
  options: BoatOptions;
  client: ClientI;
  owners: Snowflake[];
  prefix: string;
  events: any;
  rafts: any;
  commands: any;
  interactions: any;
  token: string;
  debug: boolean;
  ending: boolean;

  /**
   * The logging options
   * @typedef {Object} LogOptions
   * @property {LogLevel} [maxLevel=error] the maximum level of logging to allow in the output file
   * @property {string} outputFile the location of the output file, either relative or direct path
   * @property {boolean} [verbose=false] whether to log verbose to the console
   * @property {string} webhookToken the token for the logging webhook (LOG_WEBHOOK_TOKEN in env if not provided)
   */

  /**
   * Options for creating a boat
   * @typedef {Object} BoatOptions
   * @prop {boolean} [debug=false] whether this boat is in debug mode
   * @prop {string} token the token to use for login
   * @prop {ClientOptions} [clientOpts] the options to pass to djs
   * @prop {Snowflake[]} [owners] the owners of the bot
   * @prop {string} [commandPrefix=!] the prefix used for standard message commands
   * @prop {LogOptions} log the webhook token for logging errors to discord
   */

  /**
   * Creates a new boat.
   * @param {BoatOptions} options the options to run the bot with
   */
  constructor(options) {
    if (!options) throw new Error('Boat options must be provided');

    /**
     * The options used to launc this boat
     * @type {Object}
     */
    this.options = options;
    this.options.basepath = __dirname;

    /**
     * The discord.js API / Websocket client.
     * @type {discord.js.Client}
     */
    this.client = new Client(options.clientOpts);

    /**
     * The owners of the bot
     * @type {Snowflake[]}
     */
    this.owners = options.owners;

    /**
     * The prefix used for standard message commands
     * @type {string}
     */
    this.prefix = options.commandPrefix ?? '!';

    /**
     * The events that this client will handle
     * @type {Object}
     */
    this.events = events;

    /**
     * The sub modules that this boat handles
     * @type {Object}
     */
    this.rafts = {};

    /**
     * The text based commands that can be called, mapped by name
     * @type {Collection<string, BaseCommand>}
     */
    this.commands = new Collection();

    /**
     * The interactions that can be called, mapped by name
     * @type {Object}
     */
    this.interactions = {
      commands: new Collection(),
      buttonComponents: new Collection(),
      selectMenuComponents: new Collection(),
      userContextMenuComponents: new Collection(),
      messageContextMenuComponents: new Collection(),
      autocomplete: new Collection(),
    };

    /**
     * The token used to connect to discord
     * @type {string}
     * @private
     */
    this.token = options.token;

    /**
     * Whether the boat is in debug mode
     * @type {boolean}
     */
    this.debug = options.debug ?? false;

    this.initLog();
  }

  /**
   * Connect the boat to discord and register events
   * @returns {Promise}
   */
  async boot() {
    // Iniatiate all rafts
    this.log.debug(module, 'Launching rafts');
    await util.objForEach(rafts, this.launchRaft.bind(this));

    // Register all text based commands
    this.log.debug(module, 'Collecting commands');
    this.setCommands();

    // Register all interactions
    this.log.debug(module, 'Collecting interactions');
    this.setInteractions();

    this.log.debug(module, 'Registering events');
    this.attach();

    // Loads databases
    for (const [key, value] of Object.entries(databases)) {
      this.client[key] = value;
    }
    this.client.maldata.ensure('states', {});
    
    return this.client.login(this.token).catch(err => this.log.critical(module, err));
  }

  /**
   * Register a raft tpo this boat
   * @param {BaseRaft} raft the raft to register
   * @param {string} name the name of the raft
   * @private
   */
  async launchRaft(raft, name) {
    if (name === 'captainsLog') return;
    raft = new raft(this);
    if (!(raft instanceof BaseRaft)) throw new TypeError('All rafts must extend BaseRaft');
    if (!raft.active) return;
    await raft.launch();
    this.rafts[name] = raft;
  }

  /**
   * Launches the logging raft
   */
  initLog() {
    const raft = new rafts.captainsLog(this);
    if (!(raft instanceof BaseRaft)) throw new TypeError('All rafts must extend BaseRaft');
    if (!raft.active) return;
    raft.launch();
    this.rafts.captainsLog = raft;
  }

  /**
   * Associate all commands from their rafts
   * @private
   */
  setCommands() {
    util.objForEach(this.rafts, raft => {
      raft.commands?.forEach((command, commandName) => {
        this.commands.set(commandName, command);
      });
    });
  }

  /**
   * Associate all interactions from their rafts
   * @private
   */
  setInteractions() {
    util.objForEach(this.rafts, raft => {
      util.objForEach(raft.interactions, (interactions, type) => {
        interactions.forEach((interaction, name) => {
          this.interactions[type].set(name, interaction);
        });
      });
    });
  }

  /**
   * Register an interaction
   * @param {number} type the type of the command that is being registered
   * @param {string} name the name of the command to register
   * @returns {*}
   */
  async registerInteraction(type, name: string | string[]) {
    let interaction;
    //@ts-ignore
    let path = this.client.api as any;
    let promises = [];
    let results;
    switch (type) {
      case 2:
        let names = [];
        if (name === 'all') names = Array.from(this.interactions.commands.keys())
        else if (Array.isArray(name)) names = name
        else names.push(name)

        for (let i = 0; i < names.length; i++) {
          interaction = this.interactions.commands.get(names[i]);
          if (!interaction) return `No such interaction (${names[i]})`;
          if (!interaction.definition) return `This command has no definition (${names[i]})`;
          path = path.applications(this.client.user.id);
          if (Array.isArray(interaction.guild)) {
            interaction.guild.forEach(guild => {
              promises.push(path.guilds(guild).commands.post({ data: interaction.definition }));
            });
            results = await Promise.all(promises).catch(err => this.log.warn(module, `Error encountered while registering commmand: ${err.stack ?? err}`));
            return results.map(result => ({ guild: result.guild_id, id: result.id, name: result.name }));
          }
          if (interaction.guild) {
            path = path.guilds(interaction.guild);
          }
          return path.commands
            .post({ data: interaction.definition })
            .catch(err => this.log.warn(module, `Error encountered while registering commmand: ${err.stack ?? err}`));
        }
        default:
    }
    return 'Invalid type';
  }

  /**
   * Attach the event listeners to the socket.
   * @private
   */
  attach() {
    if (!this.events) return;

    Object.entries(this.events).forEach(([event, listener]) => {
      this.listen(event, listener);
    });
  }

  /**
   * Listen for a socket event.
   * @param {string} event the name of the event to listen for
   * @param {Function} listener the function to call on event
   * @private
   */
  listen(event, listener) {
    this.client.on(event, (...args) => {
      listener(this, ...args);
    });
  }

  /**
   * Logging shortcut. Logs to `info` by default. Other levels are properties.
   * @type {Logging}
   * @readonly
   */
  get log() {
    return logBuilder(this);
  }

  async end(code) {
    this.log.debug(module, `Shutting Down`);
    this.ending = true;
    // Panic out if something broke
    const panic = setTimeout(() => process.exit(code), 5000);
    await this.client.destroy();
    this.rafts.captainsLog.webhook.destroy();
    /* eslint-disable-next-line no-empty-function */
    await new Promise(resolve => this.rafts.captainsLog.driver.end(resolve)).catch(() => {});
    clearTimeout(panic);
    process.exit(code);
  }

  toJSON() {
    return {
      client: 'discordjsClient',
      prefix: this.prefix,
      events: this.events,
      rafts: this.rafts,
      commands: this.commands,
      debug: this.debug,
      token: 'HAHA, you thought!',
    };
  }
}


export default Boat;