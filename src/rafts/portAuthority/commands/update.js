'use strict';

const { exec } = require('child_process');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../BaseCommand');

class UpdateCommand extends BaseCommand {
  constructor(boat) {
    const info = {
      name: 'update',
      description: 'updates to the latest master (make sure .env is still good!)',
      owner: true,
      enabled: true,
    };
    super(boat, info);
  }

  async run(message) {
    let embed = new MessageEmbed().setColor('BLURPLE');
    let { stdout, stderr } = await promiseExec('git pull').catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Git Pulled').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send(embed);

    ({ stdout, stderr } = await promiseExec('npm i').catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Packages Updated').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send(embed);
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

function clean(text) {
  if (typeof text === 'string') {
    return text.replace(/` /g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}

module.exports = UpdateCommand;
