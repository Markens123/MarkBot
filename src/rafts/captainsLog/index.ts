'use strict';

import * as util from 'util';
import { WebhookClient, MessageEmbed, MessageAttachment, Snowflake } from 'discord.js';
import wn from 'winston';
import { LogLevels, LogColors, DiscordColors } from '../../util/Constants.js';
import BaseRaft from '../BaseRaft.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
var module = __filename;

/**
 * Logging raft for the boat.
 * @extends {BaseRaft}
 */
class CaptainsLog extends BaseRaft {
  driver: wn.Logger;
  webhook: WebhookClient;
  constructor(boat) {
    super(boat);
    /**
     * The log driver.
     * @type {Winston}
     * @private
     */
    this.driver = wn.createLogger({
      levels: LogLevels.console,
      format: wn.format.combine(
        wn.format.colorize(),
        wn.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        wn.format.printf(info => `${info.timestamp} ${info.level} ${info.message}`),
      ),
      transports: [
        new wn.transports.Console({
          level: boat.options.log.verbose ? 'verbose' : boat.debug ? 'debug' : 'error',
          handleExceptions: true,
        }),
        new wn.transports.File({
          handleExceptions: true,
          filename: boat.options.log.outputFile,
          level: boat.options.log.maxLevel ?? 'error',
        }),
      ],
    });

    wn.addColors(LogColors);
  }

  launch() {
    const token = this.boat.options.log.webhookToken.split('/') as Snowflake[]; 
    /**
     * The webhook client that handles sending error logs to discord
     * Only available after launching
     * @type {WebhookClient}
     * @private
     */
    this.webhook = new WebhookClient(token[0], token[1]);
  }

  /**
   * Write a message to the log.
   * @param {LogLevel} level the log level
   * @param {Module} source the module sourcing this log
   * @param {string} [message] the message to output
   * @param {Error} [error] the full error object to use for a stacktrace
   */
  async out(level, source, message = 'No message specified', error) {
    const path = this.path(source);
    //@ts-ignore
    if (!error && message instanceof Error) {
      error = message;
      message = '';
    }
    let formattedError = '';
    if (error) {
      formattedError = util.inspect(error, { depth: 6, colors: true });
    }
    this.driver.log(level, `[${path}] ${message}${message && formattedError ? `: ` : ''}${formattedError}`);
    if (LogLevels.webhook[level]) {
      await this.logDiscord(level, path, message, error);
    }
  }

  /**
   * Exit the process after writing a message to the log.
   * @param {LogLevel} level the log level
   * @param {Module} source the module sourcing this log
   * @param {string} [message] the message to output
   * @param {Error} [error] the full error object to use for a stacktrace
   */
  async fatal(level, source, message, error) {
    const path = this.path(source);
    await this.out(level, path, message, error);
    this.boat.end(1);
  }

  /**
   * Send a log message via webhook.
   * @param {LogLevel} level the log level
   * @param {string} path the path to the module that this occured in
   * @param {string} message the message to send
   * @param {Error} [error] the full error object to use for a stacktrace
   * @returns {Promise<Message>}
   * @private
   */
  logDiscord(level, path, message, error) {
    const levels = LogLevels.webhook;

    if (!Object.prototype.hasOwnProperty.call(levels, level)) return Promise.reject(new Error('Invalid level'));

    if (!error && message instanceof Error) {
      error = message;
      message = '';
    }
    let formattedError;
    if (error) {
      formattedError = util.inspect(error, { depth: 6 });
    }

    let formatted = typeof message === 'string' ? message : String(message) as any;
    if (formattedError) {
      formatted += `: ${formattedError}`;
    }
    formatted = formatted.split('\n').slice(0, 4);
    let code = false;
    for (const i in formatted) {
      let line = formatted[i];
      if (line.trim().startsWith('at')) {
        formatted[i] = `\`\`\`ada\n${line}`;
        code = true;
        break;
      }
    }
    formatted = `${formatted.join('\n')}${code ? '```' : ''}`;

    const embed = new MessageEmbed()
      .setDescription(formatted)
      .setTimestamp(Date.now())
      .setTitle(`${level} \u00B7 ${path}`)
      .setColor(DiscordColors[levels[level] ?? 'CYAN']);

    const attachments: MessageAttachment[] = [];

    if (error?.stack && formattedError.length > 100) {
      attachments.push(new MessageAttachment(Buffer.from(formattedError), 'stacktrace.ada'));
    }

    return this.webhook.send({embeds: [embed], files: attachments}).catch(err => {
      this.driver.log('error', `[${this.path(module)}] Failed to send webhook`, err);
    });
  }  
  /**
   * Calculate the path of the given source module.
   * @param {Module} source the module that made this log
   * @returns {string}
   * @private
   */
  path(source) {
    if (!source.id) return source;
    /* eslint-disable-next-line newline-per-chained-call */
    return source.id.split('.').shift().replace(`${this.boat.options.basepath}/`, '').replace(/\//g, '.');
  }
}

export default CaptainsLog;
export { LogLevels };
