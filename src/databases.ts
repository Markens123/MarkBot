import Enmap from 'enmap';
import { Collection } from 'discord.js';

const databases: any = {};

databases.maldata = new Enmap('MALData');
databases.rdata = new Enmap('RData');
databases.cooldowns = new Collection();
databases.overrides = new Enmap('Overrides');

export default databases;
