// Import dependencies
import { REST } from '@discordjs/rest';
import { Client, Collection, Routes, Snowflake } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { BoatI, BoatOptions, ClientI, InteractionsI, RequestI } from '../lib/interfaces/Main.js';
import databases from './databases.js';
import events from './events/index.js';
import BaseLoop from './loops/BaseLoop.js';
import loops from './loops/index.js';
import BaseRaft from './rafts/BaseRaft.js';
import logBuilder from './rafts/captainsLog/LogRouter.js';
import rafts from './rafts/index.js';
import { util } from './util/index.js';
import express, { Express } from 'express';
import router from './webhooks/router.js';
import bodyParser from 'body-parser';

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
  interactions: InteractionsI;
  loops: Collection<string, BaseLoop>;
  token: string;
  debug: boolean;
  app: Express;
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
     * The options used to launch this boat
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
     * Loops, mapped by name
     * @type {Collection<string, BaseLoop>}
     */
    this.loops = new Collection();

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
      modals: new Collection(),
      subcommands: new Collection(),
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

    // Register all loops
    this.log.debug(module, 'Collecting loops');
    await util.objForEach(loops, this.launchLoop.bind(this));

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
    this.client.maldata.ensure('queue', []);
    this.client.halerts.ensure('latest', []);
    this.client.animealerts.ensure('latest', {});
    this.client.dalerts.ensure('latest', {});

    this.launchExpress();

    return this.client.login(this.token).catch(err => this.log.critical(module, err));
  }

  /**
   * Register a raft to this boat
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
   * Associate all loops
   * @private
   */
  async launchLoop(loop, name) {
    loop = new loop(this);
    if (!(loop instanceof BaseLoop)) throw new TypeError('All loops must extend BaseLoop');
    if (loop.active) loop.start();
    this.loops.set(name, loop);
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
    const rest = new REST({ version: '10' }).setToken(this.client.token);
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
          if (Array.isArray(interaction.guild)) {
            interaction.guild.forEach(guild => {
              promises.push(
                rest.post(
                  Routes.applicationGuildCommands(this.client.user.id, guild),
                  { body: interaction.definition },
                )
              )
            });
            results = await Promise.all(promises).catch(err => this.log.warn(module, `Error encountered while registering commmand: ${err.stack ?? err}`));
            return results.map(result => ({ guild: result.guild_id, id: result.id, name: result.name }));
          }
          if (interaction.guild) {
            return rest.post(
              Routes.applicationGuildCommands(this.client.user.id, interaction.guild),
              { body: interaction.definition },
            ).catch(err => this.log.warn(module, `Error encountered while registering commmand: ${err.stack ?? err}`));
          }
          return rest.post(
            Routes.applicationCommands(this.client.user.id),
            { body: interaction.definition }
          ).catch(err => this.log.warn(module, `Error encountered while registering commmand: ${err.stack ?? err}`));
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
   * Starts express server for app.
   */
  launchExpress() {
    const client = this.client;
    let app = express();
    
    app.use(bodyParser.text());
    app.use(bodyParser.json());

    app.get('/callback', async ({ query }, response) => {
      const { code, state } = query;

      if (code && state) {
        let user = client.maldata.find(val => Object.keys(val).some(k => { return val[k] === state }));
        if (user) {
          user = Object.keys(user)[0]
          const out = await this.rafts.Anime.apis.oauth.getToken(code).catch(err => { this.log.verbose(this.options.basepath, `Error getting token ${err}`) });
          if (!out.access_token) response.sendFile('error.html', { root: '.' });
          client.maldata.set(user, out.access_token, 'AToken');
          client.maldata.set(user, out.refresh_token, 'RToken');
          client.maldata.set(user, Date.now() + (out.expires_in * 1000), 'EXPD');
          client.maldata.delete('states', user);
          return response.sendFile('successful.html', { root: '../' });
        }
      }

      return response.sendFile('error.html', { root: '../' });
    });

    app.use('/hooks', (req: RequestI, res, next) => {
      req.boat = this;
      next()
    })

    app.use('/hooks', router);

    app.listen(process.env.PORT, () => this.log('#', `App listening at http://localhost:${process.env.PORT}`));
    this.app = app; 
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
    await new Promise(resolve => this.rafts.captainsLog.driver.end(resolve)).catch(() => { });
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
