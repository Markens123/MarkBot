import { exec } from 'child_process';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class UpdateCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'update',
      description: 'Updates to the latest master (make sure .env is still good!)',
      owner: true,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Message, args: string[]) {
    let branch = false;
    if (args.includes('--branch') || args.includes('-b')) {
      if (message.author.id !== '396726969544343554') message.channel.send('Only Markens can change the branch for reasons™️');
      const index = args.indexOf('--branch') > -1 ? args.indexOf('--branch') : args.indexOf('-b');
      branch = args[index + 1] as any;
      args.splice(index, 2);
      if (message.author.id !== '396726969544343554') branch = false;
    }
    let embed = new MessageEmbed().setColor('BLURPLE');
    if (branch !== false) {
      let { stdout, stderr } = await promiseExec(`git checkout ${branch}`).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
      if (!stdout && !stderr) return;
      embed.setTitle('Branch switched').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
      await message.channel.send({embeds: [embed]});
    }
    let { stdout, stderr } = await promiseExec('git pull').catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Git Pulled').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send({embeds: [embed]});

    ({ stdout, stderr } = await promiseExec('npm i').catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Packages Updated').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send({embeds: [embed]});
    ({ stdout, stderr } = await promiseExec('npm run build').catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    let attachment = new MessageAttachment(Buffer.from(`${stdout}\n${stderr}`, 'utf-8'), 'transpiled.bash')
    await message.channel.send({files: [attachment]});

  }
}

function promiseExec(action): Promise<any> {
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

function clean(text: string): string {
  if (typeof text === 'string') {
    return text.replace(/` /g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}

export default UpdateCommand;