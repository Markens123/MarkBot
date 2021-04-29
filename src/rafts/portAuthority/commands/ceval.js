'use strict';

const Discord = require('discord.js');
const BaseCommand = require('../../BaseCommand');
const { exec } = require('child_process');

class CEvalCommand extends BaseCommand {
  constructor(boat) {
    const options = {
      name: 'ceval',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message, args) {
    let nf = false;
    if (args.includes('--nofile') || args.includes('-n')) {
      const index = args.indexOf('--nofile') > -1 ? args.indexOf('--nofile') : args.indexOf('-n');
      nf = true;
      args.splice(index, 1);
    }
    /* eslint-disable-next-line no-unused-vars */
    const client = this.boat.client;
    args = args.join(' ');
    if (args.toLowerCase().includes('.env') || args.toLowerCase().includes('token') || args.toLowerCase().includes('secret')) {
      message.channel.send(`Error: Execution of command refused`);
      return message.channel.send('https://media.tenor.com/images/59de4445b8319b9936377ec90dc5b9dc/tenor.gif');
    }
    let stdout, stderr;
    let e = false;
    try {
        let out = await promiseExec(args)
        stdout = out.stdout
        stderr = out.stderr
    } 
    catch(error) {
    stderr = error;
    e = true
    }
    let embed = new Discord.MessageEmbed()
    .setColor(e === true ? 'FF0000' : '32CD32')
    .addField('📥 Input', `\`\`\`bash\n${args}\`\`\``)
    let out = stderr + stdout
    if (out.split(/\r\n|\r|\n/).length > 4) {
      if (nf === true) {
        embed.addField('📤 Output', `\`\`\`bash\n${out.slice(0, 1000)}\n\`\`\``)
        return message.channel.send(embed);
      }
      embed.addField('📤 Output', '\`\`\`Eval output too long, see the attached file\`\`\`')
      let attachment = new Discord.MessageAttachment(Buffer.from(out, 'utf-8'), 'eval.bash');
      await message.channel.send(embed)
      return message.channel.send(attachment);
    }
    embed.addField('📤 Output', `\`\`\`bash\n${out}\`\`\``)
    return message.channel.send(embed);
  }
}

function promiseExec(action) {
    return new Promise((resolve, reject) =>
      exec(action, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }),
    );
  }

module.exports = CEvalCommand;