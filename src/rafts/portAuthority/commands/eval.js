'use strict';

const util = require('util');
const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');

class EvalCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'eval',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let depth = 2;
    let nf = false;
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
    if (args.toLowerCase().includes('token') || args.toLowerCase().includes('secret')) {
      message.channel.send(`Error: Execution of command refused`);
      return message.channel.send('https://media.tenor.com/images/59de4445b8319b9936377ec90dc5b9dc/tenor.gif');
    }
    if (args.toLowerCase().includes('await')) args = `(async () => {${args}})()`
    let evaluated;
    let e = false;
    try {
    evaluated = await eval(args);
    } 
    catch(error) {
    evaluated = error;
    e = true
    }
    if (evaluated === this.boat) {
      evaluated = this.boat.toJSON();
    }
    let cleaned = await this.clean(client, util.inspect(evaluated, { depth }));
    let embed = new Discord.MessageEmbed()
    .setColor(e === true ? 'FF0000' : '32CD32')
    .addField('📥 Input', `\`\`\`js\n${args}\`\`\``)
    
    if (cleaned.split(/\r\n|\r|\n/).length > 4) {
      if (nf === true) {
        embed.addField('📤 Output', `\`\`\`js\n${cleaned.slice(0, 1000)}\n\`\`\``)
        return message.channel.send(embed);
      }
      embed.addField('📤 Output', '\`\`\`Eval output too long, see the attached file\`\`\`')
      let attachment = new Discord.MessageAttachment(Buffer.from(cleaned, 'utf-8'), 'eval.js');
      await message.channel.send(embed)
      return message.channel.send(attachment);
    }
    embed.addField('📤 Output', `\`\`\`js\n${cleaned}\`\`\``)
    return message.channel.send(embed);
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

module.exports = EvalCommand;
