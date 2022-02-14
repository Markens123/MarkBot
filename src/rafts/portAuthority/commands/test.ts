import { Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';

import BaseCommand from  '../../BaseCommand.js';

class TestCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'test',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  run(message: Message, args: any) {
  }
}

export default TestCommand;
