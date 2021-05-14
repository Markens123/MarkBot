'use strict';

const { exec } = require('child_process');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../BaseCommand');
const { clean, promiseExec } = require('../../../util/functions')

class UpdateCommand extends BaseCommand {
  constructor(raft) {
    const info = {
      name: 'update',
      description: 'updates to the latest master (make sure .env is still good!)',
      owner: true,
      enabled: true,
    };
    super(raft, info);
  }

  async run(message, args) {
    let branch = false;
    if (args.includes('--branch') || args.includes('-b')) {
      if (message.author.id !== '396726969544343554') message.channel.send('Only Markens can change the branch for reasons™️');
      const index = args.indexOf('--branch') > -1 ? args.indexOf('--branch') : args.indexOf('-b');
      branch = args[index + 1];
      args.splice(index, 2);
      if (message.author.id !== '396726969544343554') branch = false;
    }
    let embed = new MessageEmbed().setColor('BLURPLE');
    await promiseExec('git stash', exec).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
    if (branch !== false) {
      let { stdout, stderr } = await promiseExec(`git checkout ${branch}`, exec).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
      if (!stdout && !stderr) return;
      embed.setTitle('Branch switched').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
      await message.channel.send(embed);
    }
    let { stdout, stderr } = await promiseExec('git pull', exec).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Git Pulled').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send(embed);
    await promiseExec('git stash pop', exec).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``));

    ({ stdout, stderr } = await promiseExec('npm i', exec).catch(err => message.channel.send(`\`\`\`bash\n${err}\`\`\``)));
    if (!stdout && !stderr) return;
    stdout = clean(stdout);
    stderr = clean(stderr);
    embed.setTitle('Packages Updated').setDescription(`\`\`\`bash\n${stdout}\n${stderr}\`\`\``);
    await message.channel.send(embed);
  }
}


module.exports = UpdateCommand;