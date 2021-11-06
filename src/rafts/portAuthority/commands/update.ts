import { exec } from 'child_process';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';
var module = fileURLToPath(import.meta.url);

class UpdateCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'update',
      description: 'Updates to the latest master (make sure .env is still good!)',
      owner: true,
      enabled: true,
      args: [
        {
          name: 'branch',
          type: 'flag',
          index: 1,
          flags: ['--branch', '-b'],
          default: false
        },
        {
          name: 'reboot',
          type: 'flag',
          index: 0,
          flags: ['--reboot', '-r'],
          default: false

        }
      ]
    };
    super(raft, options);
  }

  async run(message: Message, args: any) {
    let branch = args.branch;
    let reboot = args.reboot;

    let embed = new MessageEmbed().setColor('BLURPLE');

    if (branch) {
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

    if (reboot) {
      this.boat.log(module, 'Reboot instruct received');

      await message.channel.send('Rebooting now!').catch(err => {
        this.boat.log.warn(module, err);
      });

      this.boat.end(0);
    }

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