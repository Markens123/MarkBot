
import { fileURLToPath } from 'url';
import { BoatI } from '../../lib/interfaces/Main';
var module = fileURLToPath(import.meta.url);



export default (boat: BoatI) => {
  const client = boat.client;

  boat.log(module, 'Connected to discord!');
  client.channels.fetch('807033695483461632');
  client.channels.fetch('883882042532700190');
  
  client.reminders.clear()

};
