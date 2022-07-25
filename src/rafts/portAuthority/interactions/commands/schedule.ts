import { CommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'schedule',
  description: "Check's your schedule",
};

class ScheduleInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'schedule',
      guild: '816098833054302208',
      enabled: true,
      definition,
    };
    super(raft, info);
  }

  async run(interaction: CommandInteraction) {
    const client = this.boat.client;

    const temp = {
      1: 'Modern Chem',
      2: 'Algebra',
      3: 'Spanish',
      4: 'Tech',
      5: 'World History',
      6: {
        A: 'Gym',
        B: 'Band',
        D: 'Gym',
        8: 'Band'
      },
      7: 'English',
      8: 'Website Dev.'
    }

    const date_str = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const date = new Date(date_str);

    const { c, day, next_class, next_class_ts, period, class_end } = getData(date, temp);
    const embed = new EmbedBuilder();
    console.log({ c, day, next_class, next_class_ts, period, class_end })
    if (day !== 'Sunday' && day !== 'Saturday') embed.setFooter({text: `${day} day`}).setTimestamp()


    if (c && next_class.p === 'Lunch') {
      embed.setColor('Aqua')
      .addFields([
        {name: 'Current', value: `You currently have **${c}** and it will end <t:${class_end}:R>`},
        {name: 'Next', value: `You have **Lunch** next and it will start <t:${next_class_ts}:R>`}
      ]);

      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (period === 'NS' && next_class.p) {
      embed.setColor('Aqua')
      .addFields([
        {name: 'Current', value: `There are no class atm`},
        {
          name:'Next', 
          value: `Next period will be ${nth(next_class.p)} period and you will have **${next_class.c}** and it will will start <t:${next_class_ts}:R>`
        }
      ]);
      
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (day === 'Sunday' || day === 'Saturday') {
      embed.setColor('DarkRed').setDescription('There is no school today!');
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (!next_class.p) {
      if (!c) {
        embed.setColor('Aqua')
        .addFields([
          {name: 'Current', value: `You currently have **${c}** and it will end <t:${class_end}:R>`},
          {name: 'Next', value: 'There are no more classes scheduled for the day'}
        ]);
        
        return interaction.reply({ embeds: [embed], ephemeral: true })
      } 
      
      embed
        .setColor('DarkRed')
        .setDescription('There are no more classes scheduled for today!')
      
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (period && c && next_class.p) {
      embed
        .setColor('Aqua')
        .addFields([
          {name: 'Current', value: `You currently have **${c}** and it will end <t:${class_end}:R>`},
          {name: 'Next', value: `Next period will be ${nth(next_class.p)} period, you will have **${next_class.c}** and it will start <t:${next_class_ts}:R>}`}
        ]);

      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
    if (!period && next_class.p) {
      return embed
        .setColor('Aqua')
        .addFields({name: 'Next', value: `Next period will be ${nth(next_class.p)} period, you will have **${next_class.c}** and it will start <t:${next_class_ts}:R>`})
    }
  }
}

function nth(n){
  let t=["st","nd","rd"][((n+90)%100-10)%10-1]||"th"
  return n+t
}


function getData(date: Date, schedule) {
  const days = {
    0: 'Sunday',
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: '8',
    6: 'Saturday'
  }
  let c;
  const day = days[date.getDay()];
  if (day === 'Sunday' || day === 'Saturday') c = null;
  else {
    // check period
    let { period, next_class, next_class_ts, class_end } = getPeriod(date, day);

    if (typeof schedule[period] === 'object') {
      c = schedule[period][day]
    } 
    else c = schedule[period]

    if (typeof schedule[next_class] === 'object') {
      next_class = {c: schedule[next_class][day], p: next_class}
    } 
    else next_class = {c: schedule[next_class], p: next_class}

    return { c, day, period, next_class, next_class_ts, class_end }
  }

  return { c, day }
  

}

function getPeriod(date: Date, day: string) {
  let period = undefined;
  let next_class: any = 'NC';
  let next_class_ts; 
  let class_end;
  const arr = 
  {
    'A': [1, 2, 3, 'Lunch', 5, 6, 7],
    'B': [4, 1, 2, 'Lunch', 8, 5, 6],
    'C': [3, 4, 1, 'Lunch', 7, 8, 5],
    'D': [2, 3, 4, 'Lunch', 6, 7, 8],
    '8': [1, 2, 3, 4, 'Lunch', 5, 6, 7, 8]
  }
  let times: any = {
    1: [27720, 31020],
    2: [31200, 34500],
    3: [34680, 37980],
    4: [37980, 39720],
    5: [39900, 43200],
    6: [43380, 46680],
    7: [46860, 50160],
    8: {
      1: [27720, 30300],
      2: [30480, 32940],
      3: [33120, 35580],
      4: [35760, 38220],
      5: [38220, 39780],
      6: [39780, 42240],
      7: [42420, 44880],
      8: [45060, 47520],
      9: [47700, 50160]
    }
  }

  let timestamp = (date.getHours() * 3600) + (date.getMinutes() * 60);
  if (times[1][0] >= timestamp && times[7][1] <= timestamp) period = 'NS';
  let j = 0;

  if (day === '8') {
    for (let i = 1; i < 7; i++) {
      if (times[8][i][0] <= timestamp && times[8][i][1] >= timestamp) {
        period = arr[day][j];
        if (j <= 5) next_class = arr[day][j+1];
        class_end = times[8][i][1];
      }
      j++
  }    
  } else {
    for (let i = 1; i < 7; i++) {
        if (times[i][0] <= timestamp && times[i][1] >= timestamp) {
          period = arr[day][j];
          if (j <= 5) next_class = arr[day][j+1];
          class_end = times[i][1];  
        }
        j++
    }
  }

  day === '8' ? times = times[8] : delete times[8];

  let t = Object.values(times).map(i => i[0]).filter(i => i >= timestamp);

  let temp = t.length ? t.reduce((prev, curr) => Math.abs(curr - timestamp) < Math.abs(prev - timestamp) ? curr : prev) : undefined;

  next_class_ts = temp ? (Math.round(date.getTime()/1000)-timestamp) + (temp) : undefined;
  class_end = class_end ? (Math.round(date.getTime()/1000)-timestamp) + (class_end) : undefined;
  
  if (next_class === 'NC' && temp) {
    next_class = parseInt(Object.keys(times).find(key => times[key].includes(temp)))
  }
  return { period, next_class, next_class_ts, class_end }
}

const convertTime = timeStr => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
     hours = '00';
  }
  if (modifier === 'PM') {
     hours = parseInt(hours, 10) + 12;
  }
  let t = `${hours}:${minutes}`;

  let [h, m] = time.split(':');
  return h*3600 + m*60;
};

export default ScheduleInteraction;
