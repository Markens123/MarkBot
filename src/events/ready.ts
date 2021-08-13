
import { fileURLToPath } from 'url';
var module = fileURLToPath(import.meta.url);



export default boat => {
  boat.log(module, 'Connected to discord!');
  boat.client.channels.fetch('807033695483461632');
};
