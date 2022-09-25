import Discord, { ActionRowBuilder, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import glob from 'glob';
import path, { basename } from 'path';
import { fileURLToPath } from 'url';
import * as util from 'util';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import { loop } from '../../../util/Constants.js';
import BaseCommand from '../../BaseCommand.js';
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const delay = s => new Promise(res => setTimeout(res, s*1000));

class EvalCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'eval',
      owner: true,
      enabled: true,
      dms: true,
      args: [
        {
          name: 'depth',
          type: 'flag',
          index: 1,
          flags: ['--depth', '-d'],
          default: 2,
        },
        {
          name: 'nf',
          type: 'flag',
          index: 0,
          flags: ['--nofile', '-nf'],
          default: false,
        },
        {
          name: 'nr',
          type: 'flag',
          index: 0,
          flags: ['--noresp', '-nr'],
          default: false,
        },
        {
          name: 'canary',
          type: 'flag',
          index: 0,
          flags: ['--canary', '-c'],
          default: false,
        },
        {
          name: 'msg',
          type: 'msg'
        }
      ],      
    };
    super(boat, options);
  }

  async run(message: Discord.Message, { depth, nf, nr, canary, msg }, ogargs) {
    const client = this.boat.client;
    if (canary) client.options.rest.api = 'https://canary.discord.com/api';

    depth = parseInt(depth);

    let args = msg.join(' ');
    if (args.slice(-1) !== ';') args = args.concat(';');

    if (args.toLowerCase().includes('token') || args.toLowerCase().includes('secret')) {
      message.channel.send(`Error: Execution of command refused`);
      return message.channel.send('https://media.tenor.com/images/59de4445b8319b9936377ec90dc5b9dc/tenor.gif');
    }
    
    const scope = {
      message,
      client,
      boat: this.boat,
      cmd: this,
      args: ogargs,
      me: message.member ?? message.author,
      guild: message.guild,
      channel: message.channel,
      channels: message.guild?.channels,
      messages: message.channel?.messages,
      application: client.application,
      __dirname,
      readFile,
      readfile: readFile,
      loop,
      shorten,
      delay,
      Discord,
      ...Discord,
    };
  
    if (!args.toLowerCase().includes('return')) {
      if (args.split(';').length > 2) {
        const last = args.split(';').filter(Boolean).pop();
        args = args.replace(`;${last}`, `; return ${last}`).replace(/\s\s+/g, ' ');
      }
    }
    if (!args.toLowerCase().includes('return')) args = `return ${args}`;
    let evaluated;
    try {
      evaluated = args.toLowerCase().includes('await')
        ? await new AsyncFunction(...Object.keys(scope), `try {\n${args}\n} catch (err) {\n  return err;\n}`)(...Object.values(scope))
        : new Function(...Object.keys(scope), `try {\n${args}\n} catch (err) {\n  return err;\n}`)(...Object.values(scope));
      if (isPromise(evaluated)) {
        message.react('1002621741127958578');
        evaluated = await evaluated;
        message.reactions.cache.get('1002621741127958578')?.remove();
      }
    } catch (err) {
      evaluated = err;
      message.reactions.cache.get('1002621741127958578')?.remove();
    }
    let e = evaluated instanceof Error;
    if (evaluated === this.boat) {
      evaluated = this.boat.toJSON();
    }

    if (canary) client.options.rest.api = 'https://discord.com/api';

    if (evaluated instanceof ActionRowBuilder) {
      try {
        let content = 'Message'
        let msg = await message.channel.send({ content, components: [evaluated] });
        e = false;
        evaluated = msg;
      } catch (err) {
        e = true;
        evaluated = err;
      }
    }

    if (evaluated instanceof AttachmentBuilder || evaluated instanceof EmbedBuilder) {
      try {
        let msg;
        if (evaluated instanceof AttachmentBuilder) msg = await message.channel.send({ files: [evaluated] })
        else msg = await message.channel.send({ embeds: [evaluated] })
        e = false;
        evaluated = msg;
      } catch (err) {
        e = true;
        evaluated = err;
      }
    }
    const cleaned = await this.clean(client, util.inspect(evaluated, { depth }));
    const embed = new EmbedBuilder()
      .setColor(e === true ? '#FF0000' : '#32CD32')
      .addFields([
        {
          name: '📥 Input', 
          value: `\`\`\`js\n${(args.replace('(async () => {return ', '').replace('})()', '')).slice(0, 1000)}\`\`\``
        }
      ]);

    if (cleaned.split(/\r\n|\r|\n/).length > 4 || cleaned.length > 1023) {
      if (nf === true) {
        embed.addFields([{name: '📤 Output', value: `\`\`\`js\n${cleaned.slice(0, 1000)}\n\`\`\``}]);
        return nr && !e ? null : message.channel.send({ embeds: [embed] });
      }
      embed.addFields([{name: '📤 Output', value: '```Eval output too long, see the attached file```'}]);
      const attachment = new AttachmentBuilder(Buffer.from(cleaned, 'utf-8'), {name: 'eval.js'});
      nr && !e ? null : await message.channel.send({ embeds: [embed] })
      return nr && !e ? null : message.channel.send({ files: [attachment] });
    }
    embed.addFields({name: '📤 Output', value: `\`\`\`js\n${cleaned}\`\`\``})
    return nr && !e ? null : message.channel.send({ embeds: [embed] });
  }

  clean(client, text) {
    if (typeof text === 'string') {
      /* client.maldata.fetchEverything().forEach(element => {
        text = text.replace(element.AToken, 'Redacted')
        .replace(element.RToken, 'Redacted')
      }); */ 
      return text
        .replace(/` /g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`)
        .replace(this.boat.token, 'Redacted')
        .replace(this.boat.options.log.webhookToken, 'Redacted');
    }
    return text;
  }
}

function isPromise(value) {
  return value && typeof value.then == 'function';
}

function readFile(path, text = false, newname = undefined) {
  const options = {
    cwd: `${__dirname}../../../../../`,
    realpath: true,
  };

  const filepath = glob.sync(path, options)[0];

  if (!filepath) return new SyntaxError('That file does not exist');

  const file = fs.readFileSync(filepath, { encoding: 'utf8' });

  if (text) return file;
  else return new AttachmentBuilder(Buffer.from(file), {name: newname ?? basename(filepath)});
}

function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
}

export default EvalCommand;
