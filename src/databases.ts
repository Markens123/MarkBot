import Enmap from 'enmap';
import { Collection } from 'discord.js';

const databases: any = {};

databases.maldata = new Enmap('MALData');
databases.reminders = new Enmap('RData');
databases.halerts = new Enmap('HAData')
databases.cooldowns = new Collection();
databases.loops = new Collection();

export default databases;
