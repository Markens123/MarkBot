import { Collection } from 'discord.js';
import Enmap from 'enmap';
import equipment from '../data/equipment.json' assert { type: 'json' };
import armor from '../data/armor.json' assert { type: 'json' };
import weapons from '../data/weapons.json' assert { type: 'json' };

const databases: any = {};

databases.maldata = new Enmap('MALData');
databases.reminders = new Enmap('RData');
databases.halerts = new Enmap('HAData')
databases.animealerts = new Enmap('AnimeAData');
databases.tasksdata = new Enmap('TasksData');
databases.dalerts = new Enmap('DiscordAData');
databases.cooldowns = new Collection();
databases.equipment = equipment;
databases.weapons = weapons;
databases.armor = armor;

export default databases;
