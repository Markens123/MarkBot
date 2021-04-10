'use strict';

const BaseCommand = require('../../BaseCommand');

class RebootCommand extends BaseCommand {
  constructor(boat) {
    const info = {
      name: 'reboot',
      owner: true,
      enabled: true,
    };
    super(boat, info);
  }

  async run(message) {
    this.boat.log(module, 'Reboot instruct received');

    await message.channel.send('Rebooting now!').catch(err => {
      this.boat.log.warn(module, err);
    });

    // Reboot
    this.boat.end(0);
  }
}

module.exports = RebootCommand;
