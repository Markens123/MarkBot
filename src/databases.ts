import { Collection } from 'discord.js';
import Enmap from 'enmap';
import equipment from '../lib/config/equipment.json' assert { type: 'json' };
import armor from '../lib/config/armor.json' assert { type: 'json' };
import weapons from '../lib/config/weapons.json' assert { type: 'json' };

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
