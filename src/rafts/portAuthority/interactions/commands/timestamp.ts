import { APIApplicationCommandOptionChoice, CommandInteraction, SlashCommandBuilder, Formatters } from 'discord.js';
import { DateTime } from 'luxon';
import BaseInteraction from '../../../BaseInteraction.js';

class TimestampInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'timestamp',
      enabled: true,
      guild: '816098833054302208',
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction) {
    const date = interaction.options.get('date', true).value.toString().replace('rd ', ' ').replace('st ', ' ').replace('th ', ' ').replace('nd ', ' ');
    let time = interaction.options.get('time', true).value.toString();
    const tz = interaction.options.get('timezone', false)?.value.toString() ?? 'America/New_York';
    
    if (!time.toLocaleLowerCase().includes('pm') && !time.toLocaleLowerCase().includes('am')) {
      time += ' pm'
    }
    
    time = time.trim().replace(/ +(?= )/g, '');
    let string = `${date} ${time}`;

    const dt = DateTime.fromFormat(string, "MMM d y t", { zone: tz });
    const s = dt.toSeconds()

    if (!s) {
      return interaction.reply({ content: 'The date or time that you provided is invalid', ephemeral: true })
    } else {
      let text: string[] = [];
      const t = Formatters.time(dt.toJSDate(), 't');
      const TT = Formatters.time(dt.toJSDate(), 'T');
      const d = Formatters.time(dt.toJSDate(), 'd');
      const DD = Formatters.time(dt.toJSDate(), 'D');
      const f = Formatters.time(dt.toJSDate(), 'f');
      const FF = Formatters.time(dt.toJSDate(), 'F');
      const RR = Formatters.time(dt.toJSDate(), 'R');

      text.push(`\`${t}\` ${t}`);
      text.push(`\`${TT}\` ${TT}`);
      text.push(`\`${d}\` ${d}`);
      text.push(`\`${DD}\` ${DD}`);
      text.push(`\`${f}\` ${f}`);
      text.push(`\`${FF}\` ${FF}`);
      text.push(`\`${RR}\` ${RR}`);

      interaction.reply({ content: text.join('\n'), ephemeral: true })
    }
  }
}

function getDefinition() {
  const choices: APIApplicationCommandOptionChoice<string>[] = [];
  const types = ['Etc/UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver', 'Asia/Shanghai', 'Europe/London', 'Europe/Paris', 'Europe/Berlin'];
  for (let i = 0; i < types.length; i++) {
    choices.push({
      name: types[i],
      value: types[i].toLowerCase()
    })
  }

  return new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Generates a timestamp from a date and time')
    .addStringOption(option => 
      option
        .setName('date')
        .setDescription('The date for the timestamp')
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('The time for the timestamp')
        .setRequired(true)
    )
    .addStringOption(option => 
      option
      .setName('timezone')
      .setDescription('The timezone for the timestamp')
      .setRequired(false)
      .addChoices(...choices))
    .toJSON()
}

export default TimestampInteraction;
