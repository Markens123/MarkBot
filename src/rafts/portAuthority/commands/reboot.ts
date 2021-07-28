'use strict';

import { Message } from 'discord.js';
import BaseCommand from '../../BaseCommand.js';
import { fileURLToPath } from 'url';
var module = fileURLToPath(import.meta.url);


class RebootCommand extends BaseCommand {
  constructor(boat) {
    const info = {
      name: 'reboot',
      owner: true,
      enabled: true,
    };
    super(boat, info);
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
