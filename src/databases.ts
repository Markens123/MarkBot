import { Collection } from 'discord.js';
import Enmap from 'enmap';
import * as fs from "fs"
const databases: any = {};

databases.maldata = new Enmap('MALData');
fs.writeFile('./databases.maldata.json', databases.maldata.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.maldata.clear();
});
databases.reminders = new Enmap('RData');
fs.writeFile('./databases.reminders.json', databases.reminders.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.reminders.clear();
});
databases.halerts = new Enmap('HAData');
fs.writeFile('./databases.halerts.json', databases.halerts.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.halerts.clear();
});
databases.animealerts = new Enmap('AnimeAData');
fs.writeFile('./databases.animealerts.json', databases.animealerts.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.animealerts.clear();
});
databases.tasksdata = new Enmap('TasksData');
fs.writeFile('./databases.tasksdata.json', databases.tasksdata.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.tasksdata.clear();
});
databases.dalerts = new Enmap('DiscordAData');
fs.writeFile('./databases.dalerts.json', databases.dalerts.export(), () => {
  // I hope the data was in fact saved, because we're deleting it! Double-check your backup file size.
  databases.dalerts.clear();
});
databases.cooldowns = new Collection();
process.exit(1)

export default databases;
