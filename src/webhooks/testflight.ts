import BaseHook from './BaseHook.js';
import { Response } from 'express';
import { RequestI } from '../../lib/interfaces/Main.js';
import { Colors, EmbedBuilder, WebhookClient } from 'discord.js';

class TestFlightHook extends BaseHook {
  constructor() {
    const options = {
      name: 'tf',
      active: true,
      gate: true,
      type: 'post'
    };
    super(options);
  }

  async run({ boat, body }: RequestI, res: Response) {
    const content: string = body.toString();
    const MENTION = '396726969544343554';
    const webhook = new WebhookClient({ url: boat.options.tokens.testflight });
    if (content) {
      const msg = content.match(/Message: ([A-Za-z0-9\s]+)(\r?\n)/)?.[1].trim() || 'None';
      const branch = content.match(/Branch: ([A-Za-z0-9-\/\s]+)(\r?\n)/)?.[1].trim() || 'None';
      const commit = content.match(/Commit: ([A-Za-z0-9\s]+)(\r?\n)/)?.[1].trim() || 'None';
      const buildn = content.match(/Build Number: ([A-Za-z0-9\s]+)(\r?\n)/)?.[1].trim() || 'None';
      const creator = content.match(/Creator: ([A-Za-z0-9\s]+)(\r?\n)/)?.[1].trim() || 'None';

      if (new Set([msg, branch, commit, buildn, creator]).size === 1) {
        const version = content.match(/Discord - Chat, Talk & Hangout(.+?)is ready to test on iOS/)?.[1].trim()
        const embed = new EmbedBuilder()
          .setTitle('New TestFlight Update')
          .addFields([{ name: 'Version', value: version }])
          .setColor(Colors.Red);
        await webhook.send({ content: `<@${MENTION}>`, embeds: [embed] })
        return res.sendStatus(200);
      } else {
        const embed = new EmbedBuilder()
          .setTitle('New TestFlight Update')
          .setDescription(msg)
          .addFields([
            {
              name: 'Build Number',
              value: buildn
            },
            {
              name: 'Commit',
              value: commit
            },
            {
              name: 'Branch',
              value: branch
            },
            {
              name: 'Creator',
              value: creator
            }
          ])
          .setColor(Colors.Red);
        await webhook.send({ content: `<@${MENTION}>`, embeds: [embed] })
        return res.sendStatus(200);
      }

    }
  }
}

export default TestFlightHook;