import { Message, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import BaseCommand from '../../BaseCommand.js';
import { exec } from 'child_process';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

class CEvalCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'ceval',
      owner: true,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Message, args: any): Promise<any> {
    let nf = false;
    if (args.includes('--nofile') || args.includes('-n')) {
      const index = args.indexOf('--nofile') > -1 ? args.indexOf('--nofile') : args.indexOf('-n');
      nf = true;
      args.splice(index, 1);
    }
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
    const embed = new EmbedBuilder()
      .setColor(e === true ? '#FF0000' : '#32CD32')
      .addFields([{name: '📥 Input', value: `\`\`\`bash\n${args}\`\`\``}]);

    const out = stderr + stdout;

    if (out.split(/\r\n|\r|\n/).length > 4) {
      if (nf === true) {
        embed.addFields([{name: '📤 Output', value: `\`\`\`bash\n${out.slice(0, 1000)}\n\`\`\``}]);
        return message.channel.send({ embeds: [embed] });
      }
      embed.addFields([{name: '📤 Output', value: '```Eval output too long, see the attached file```'}]);
      const attachment = new AttachmentBuilder(Buffer.from(out, 'utf-8'), {name: 'eval.bash'});
      await message.channel.send({ embeds: [embed] });
      return message.channel.send({ files: [attachment] });
    }
    embed.addFields([{name: '📤 Output', value: `\`\`\`bash\n${out}\`\`\``}]);
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
