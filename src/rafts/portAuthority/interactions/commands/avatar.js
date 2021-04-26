'use strict';

const BaseInteraction = require('../../../BaseInteraction');

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
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction, args) {
    const client = this.boat.client;
    let user = args?.find(arg => arg.name === `user`)?.value;
    let res = await client.users.fetch(user).then(myUser => {
      return myUser.displayAvatarURL({size: 256})
    }).catch(error => {return error}) 

    interaction.reply(res);
  }
}

module.exports = AvatarInteraction;
