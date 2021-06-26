'use strict';

const BaseCommand = require('../../BaseCommand');
const glob = require('glob');

class ReloadCommandCommand extends BaseCommand {
  constructor(boat) {
    const info = {
      name: 'reloadcommand',
      owner: true,
      enabled: true,
      aliases: ['rc'],
    };
    super(boat, info);
  }

  async run(message, args) {
    let interaction = false;
    if (!args) return message.channel.send(`Usage: ${this.boat.prefix}reloadcommand <Raft> <Command> (--slashcmd)`);

    if (args.includes('--interaction') || args.includes('-i')) {
      const index = args.indexOf('--interaction') > -1 ? args.indexOf('--interaction') : args.indexOf('-i');
      interaction = args[index + 1];
      args.splice(index, 2);
    }
    const raftName = args[0];
    const commandName = args[1]?.toLowerCase();
    let basepath = interaction ? this.boat.rafts[raftName]?.interactions[interaction] : this.boat.rafts[raftName].commands 
    
    if (!basepath?.get(commandName)) return message.channel.send('The command and/or raft that have provided are invalid!');
    
    const options = {
      cwd: `${__dirname}../../../`,
      realpath: true
    }
    let path = glob.sync(`**${interaction ? `/interactions/${interaction}` : '/commands'}/${commandName}.js`, options)[0];
    delete require.cache[require.resolve(path)];
    
    try {
      const raft = this.boat.rafts[raftName];
      const command = require(path);
      basepath.set(commandName, new command(raft));
      
      interaction ? this.boat.interactions[interaction].set(commandName, raft.interactions[interaction].get(commandName)) :
        this.boat.commands.set(commandName, raft.commands.get(commandName));

      message.channel.send(`You have succesfully reloaded the command ${commandName}`)
    } catch(error) {
      console.error(error);
      message.channel.send('There was an error while reloading the command');
    }
    
  }
}

module.exports = ReloadCommandCommand;
