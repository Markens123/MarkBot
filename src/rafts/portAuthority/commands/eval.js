'use strict';

const util = require('util');
const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const glob = require('glob');
const { basename } = require('path');
const fs = require('fs');


class EvalCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'eval',
      owner: true,
      enabled: true,
      dms: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let depth = 2;
    let nf = false;
    let ogargs = args;
    if (args.includes('--depth') || args.includes('-d')) {
      const index = args.indexOf('--depth') > -1 ? args.indexOf('--depth') : args.indexOf('-d');
      depth = args[index + 1];
      args.splice(index, 2);
    }
    if (args.includes('--nofile') || args.includes('-n')) {
      const index = args.indexOf('--nofile') > -1 ? args.indexOf('--nofile') : args.indexOf('-n');
      nf = true;
      args.splice(index, 1);
    }
    /* eslint-disable-next-line no-unused-vars */
    const client = this.boat.client;
    args = args.join(' ');
    if (args.slice(-1) !== ';') args = args.concat(';');
    if (args.toLowerCase().includes('token') || args.toLowerCase().includes('secret')) {
      message.channel.send(`Error: Execution of command refused`);
      return message.channel.send('https://media.tenor.com/images/59de4445b8319b9936377ec90dc5b9dc/tenor.gif');
    }
    const scope = {
      require,
      exports,
      message,
      client,
      boat: this.boat,
      cmd: this,
      Discord,
      args: ogargs,
      me: message.member ?? message.author,
      guild: message.guild,
      channel: message.channel,
      channels: message.guild?.channels,
      __dirname,
      readFile,
      readfile: readFile,
      module,
    }
    scope.scope = {
      require,
      exports,
      message,
      client,
      boat: this.boat,
      cmd: this,
      Discord,
      args: ogargs,
      me: message.member ?? message.author,
      guild: message.guild,
      channel: message.channel,
      channels: message.guild?.channels,
      __dirname,
      readFile,
      readfile: readFile,
      module,
    }
    if (!args.toLowerCase().includes('return')) {
      if (args.split(";").length > 2) {
        let last = args.split(";").filter(Boolean).pop();
        args = args.replace(`;${last}`, `; return ${last}`).replace('  ', ' ');
      }
    }
    if (!args.toLowerCase().includes('return')) args = 'return ' + args;
    let evaluated;
    try {
    evaluated = args.toLowerCase().includes('await') 
      ? await new AsyncFunction(
          ...Object.keys(scope), 
          `try {\n${args}\n} catch (err) {\n  return err;\n}`
        )(...Object.values(scope))
      : new Function(
        ...Object.keys(scope),
        `try {\n${args}\n} catch (err) {\n  return err;\n}`
        )(...Object.values(scope));
    if (isPromise(evaluated)) {
        evaluated = await evaluated;
     }      
    } catch (err) {
      evaluated = err;
    }        
    let e = evaluated instanceof Error;
    if (evaluated === this.boat) {
      evaluated = this.boat.toJSON();
    }
    if (evaluated instanceof Discord.MessageAttachment || evaluated instanceof Discord.MessageEmbed) {
      try {
        let msg;
        if (evaluated instanceof Discord.MessageAttachment) msg = await message.channel.send({ files: [evaluated] })
        else msg = await message.channel.send({ embeds: [evaluated] })
        e = false;
        evaluated = msg;
      } catch(err) {
        e = true
        evaluated = err;
      }      
    }
    let cleaned = await this.clean(client, util.inspect(evaluated, { depth }));
    let embed = new Discord.MessageEmbed()  
    .setColor(e === true ? 'FF0000' : '32CD32')
    .addField('📥 Input', `\`\`\`js\n${args.replace('(async () => {return ', '').replace('})()', '')}\`\`\``)
    
    if (cleaned.split(/\r\n|\r|\n/).length > 4) {
      if (nf === true) {
        embed.addField('📤 Output', `\`\`\`js\n${cleaned.slice(0, 1000)}\n\`\`\``)
        return message.channel.send({ embeds: [embed] });
      }
      embed.addField('📤 Output', '\`\`\`Eval output too long, see the attached file\`\`\`')
      let attachment = new Discord.MessageAttachment(Buffer.from(cleaned, 'utf-8'), 'eval.js');
      await message.channel.send({ embeds: [embed] })
      return message.channel.send({ files: [attachment] });
    }
    embed.addField('📤 Output', `\`\`\`js\n${cleaned}\`\`\``)
    return message.channel.send({ embeds: [embed] });
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
    return value && typeof value.then == "function";
}

function readFile(path, text = false) {
  const options = {
    cwd: `${__dirname}../../../../../`,
    realpath: true
  }
  let filepath = glob.sync(path, options)[0];

  if (!filepath) return new SyntaxError('That file does not exist');
  
  let file = fs.readFileSync(filepath, { encoding: 'utf8'})
  
  if (text) return file;
  else return new Discord.MessageAttachment(Buffer.from(file), basename(filepath)); 
}

module.exports = EvalCommand;
