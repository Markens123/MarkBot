import { ActionRowBuilder } from 'discord.js';
import { fileURLToPath } from 'url';
import { BoatI } from '../../lib/interfaces/Main.js';
var module = fileURLToPath(import.meta.url);

export default (boat: BoatI) => {
  const client = boat.client;

  boat.log(module, 'Connected to discord!');
  client.channels.fetch('807033695483461632');

  client.reminders.clear()

  Object.defineProperty(Array.prototype, 'chunkc', {
    value: function (chunkSize) {
      const array = this;
      return [].concat(...array.map((elem, i) => (i % chunkSize ? [] : new ActionRowBuilder().addComponents(array.slice(i, i + chunkSize)))));
    },
  });  

  Object.defineProperty(Array.prototype, 'search', {
    value: function (r) {
      const arr = this;
      const res = arr.indexOf((function() {
        var i;
        for(i in arr)
            if(r.test(arr[i]))
                return arr[i];
        })());
      
      return res;
    },
  });

};