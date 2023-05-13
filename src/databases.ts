import { Collection } from 'discord.js';
import Enmap from 'enmap';

const databases: any = {};

databases.maldata = new Enmap('MALData');
databases.reminders = new Enmap('RData');
databases.halerts = new Enmap('HAData')
databases.animealerts = new Enmap('AnimeAData');
databases.tasksdata = new Enmap('TasksData');
databases.dalerts = new Enmap('DiscordAData');
databases.cooldowns = new Collection();


export default databases;
