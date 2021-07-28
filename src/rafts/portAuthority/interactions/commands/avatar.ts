'use strict';

import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

const definition = {
  name: 'avatar',
  description: 'Gets the avatar of any user',
  options: [
    {
        name: "user",
        description: "User to get the avatar from.",
        type: 6,
        required: true
    }
    ]  
};

class AvatarInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'avatar',
      guild: '274765646217216003',
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction: CommandInteraction, args: any) {
    const client = this.boat.client;
    let user = args?.find(arg => arg.name === `user`)?.value;
    let res = await client.users.fetch(user).then(myUser => {
      return myUser.displayAvatarURL({format: 'png' ,size: 256, dynamic: true})
    }).catch(error => {return error}) 

    interaction.reply(res);
  }
}

export default AvatarInteraction;
