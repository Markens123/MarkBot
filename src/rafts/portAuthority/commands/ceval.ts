import * as Discord from 'discord.js';
import BaseCommand from '../../BaseCommand.js';
import { exec } from 'child_process';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

class CEvalCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'ceval',
      owner: true,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Discord.Message, args: any): Promise<any> {
    let nf = false;
    if (args.includes('--nofile') || args.includes('-n')) {
      const index = args.indexOf('--nofile') > -1 ? args.indexOf('--nofile') : args.indexOf('-n');
      nf = true;
      args.splice(index, 1);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const client = this.boat.client;

    args = args.join(' ');
    if (args.toLowerCase().includes('.env') || args.toLowerCase().includes('token') || args.toLowerCase().includes('secret')) {
      message.channel.send(`Error: Execution of command refused`);
      return message.channel.send('https://media.tenor.com/images/59de4445b8319b9936377ec90dc5b9dc/tenor.gif');
    }
    let stdout, stderr;
    let e = false;
    try {
      const out = await promiseExec(args);
      stdout = out.stdout;
      stderr = out.stderr;
    } catch (error) {
      stderr = error;
      e = true;
    }
    const embed = new Discord.MessageEmbed().setColor(e === true ? '#FF0000' : '#32CD32').addField('📥 Input', `\`\`\`bash\n${args}\`\`\``);
    const out = stderr + stdout;
    if (out.split(/\r\n|\r|\n/).length > 4) {
      if (nf === true) {
        embed.addField('📤 Output', `\`\`\`bash\n${out.slice(0, 1000)}\n\`\`\``);
        return message.channel.send({ embeds: [embed] });
      }
      embed.addField('📤 Output', '```Eval output too long, see the attached file```');
      const attachment = new Discord.MessageAttachment(Buffer.from(out, 'utf-8'), 'eval.bash');
      await message.channel.send({ embeds: [embed] });
      return message.channel.send({ files: [attachment] });
    }
    embed.addField('📤 Output', `\`\`\`bash\n${out}\`\`\``);
    return message.channel.send({ embeds: [embed] });
  }
}

function promiseExec(action: any): any {
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

export default CEvalCommand;
