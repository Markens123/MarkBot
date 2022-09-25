import { Message } from 'discord.js';
import { fileURLToPath } from 'url';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';
var module = fileURLToPath(import.meta.url);

class RebootCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'reboot',
      owner: true,
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Message) {
    this.boat.log(module, 'Reboot instruct received');

    await message.channel.send('Rebooting now!').catch(err => {
      this.boat.log.warn(module, err);
    });

    // Reboot
    this.boat.end(0);
  }
}

export default RebootCommand;
