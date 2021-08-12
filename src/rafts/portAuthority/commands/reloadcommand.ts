'use strict';

import BaseCommand from '../../BaseCommand.js';
import glob from 'glob';
import { Message } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class ReloadCommandCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'reloadcommand',
      owner: true,
      enabled: false,
      aliases: ['rc'],
    };
    super(boat, options);
  }

  async run(message: Message, args: string[]) {
    let slashcmd = false;
    if (!args) return message.channel.send(`Usage: ${this.boat.prefix}reloadcommand <Raft> <Command> (--slashcmd)`);

    if (args.includes('--slashcmd') || args.includes('-s')) {
      const index = args.indexOf('--slashcmd') > -1 ? args.indexOf('--slashcmd') : args.indexOf('-s');
      slashcmd = true;
      args.splice(index, 1);
    }
    const raftName = args[0];
    const commandName = args[1]?.toLowerCase();
    
    if (!this.boat.rafts[raftName]?.commands.get(commandName) && !slashcmd) return message.channel.send('The command and/or raft that have provided are invalid!');
    if (!this.boat.rafts[raftName]?.interactions?.commands?.get(commandName) && slashcmd) return message.channel.send('The command and/or raft that have provided are invalid!');
    
    const options = {
      cwd: `${__dirname}../../../`,
      realpath: true
    }
    let path = glob.sync(`**${slashcmd ? '/interactions': ''}/commands/${commandName}.js`, options)[0];
    
    try {
      const raft = this.boat.rafts[raftName];
      const command = require(path);
      slashcmd ? raft.interactions.commands.set(commandName, new command(raft)) : 
        raft.commands.set(commandName, new command(raft));
      
      slashcmd ? this.boat.interactions.commands.set(commandName, raft.interactions.commands.get(commandName)) :
        this.boat.commands.set(commandName, raft.commands.get(commandName));
      
      message.channel.send(`You have succesfully reloaded the command ${commandName}`)
    } catch(error) {
      console.error(error);
      message.channel.send('There was an error while reloading the command');
    }
    
  }
}

export default ReloadCommandCommand;
