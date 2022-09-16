import { exec } from 'child_process';
import { Message, EmbedBuilder } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';
import { fileURLToPath } from 'url';
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
        },
        {
          name: 'python',
          type: 'flag',
          index: 0,
          flags: ['--python', '-p'],
          default: false
        }        
      ]
    };
    super(raft, options);
  }

  async run(message: Message, args: any) {
    const branch = args.branch;
    const reboot = args.reboot;
    const python = args.python;

    let embed = new EmbedBuilder().setColor('Blurple');

    if (branch) {
      let { stdout, stderr } = await promiseExec(`git checkout ${branch}`).catch((err): any => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
      if (!stdout && !stderr) return;
      embed.setTitle('Branch switched').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
      await message.channel.send({embeds: [embed]});
    }

    let { stdout, stderr } = await promiseExec('git pull').catch((err): any => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Git Pulled').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send({embeds: [embed]});

    ({ stdout, stderr } = await promiseExec('npm i').catch((err): any => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Packages Updated').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send({embeds: [embed]});
    
    if (python) {
      ({ stdout, stderr } = await promiseExec('npm run i').catch((err): any => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
      if (!stdout && !stderr) return;
      stdout = clean(stdout);
      stderr = clean(stderr);
      embed.setTitle('Python Updated').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
      await message.channel.send({embeds: [embed]});    
    }

    const build_msg = await message.channel.send('Building...');
    ({ stdout, stderr } = await promiseExec('npm run build').catch((err): any => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Build Complete').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await build_msg.edit({ content: null, embeds: [embed] });

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