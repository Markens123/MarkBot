import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class DisableInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'disable',
      guild: '816098833054302208',
      disabled: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: CommandInteraction) {
    if (!this.boat.owners.includes(interaction.user.id)) {
      this.boat.log.warn('#', `Non owner used disable command. Id: \`${interaction.user.id}\``)
      return interaction.reply({ content: 'no', ephemeral: true })
    }

    const type = interaction.options.getString('type').toLowerCase();
    const thing = interaction.options.getString('thing');
    const blocklist = ['enable', 'disable', 'reload']

    if (blocklist.includes(thing)) return interaction.reply({ content: `You cannot disable ${thing}!`, ephemeral: true })
  
    let t: any;
    let tn: string;
    let reply: string;

    switch(type) {
      case 'command':
        t = this.boat.commands.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the command ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.command':
        t = this.boat.interactions.commands.get(thing)
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the slash command ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.autocomplete':
        t = this.boat.interactions.autocomplete.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the autocomplete interaction ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.message':
        t = this.boat.interactions.messageContextMenuComponents.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the message interaction ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.user':
        t = this.boat.interactions.userContextMenuComponents.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the user interaction ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.button':
        t = this.boat.interactions.buttonComponents.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the button interaction ${tn}`;
        t.enabled = false;
        break;

      case 'interaction.select':
        t = this.boat.interactions.selectMenuComponents.get(thing);
        tn = t.name;
        !t.enabled ? reply = `${tn} is already disabled!` : reply = `You have succesfully disabled the select interaction ${tn}`;
        t.enabled = false;
        break;

      default:
        return interaction.reply({ content: 'Invalid type!', ephemeral: true })
    }
    interaction.reply({ content: reply, ephemeral: true })
  }
}

function getDefinition() {
  const choices = [];
  const types = ['Command', 'Interaction.Command', 'Interaction.Autocomplete', 'Interaction.Message', 'Interaction.User', 'Interaction.Button', 'Interaction.Select',]
  
  for (let i = 0; i < types.length; i++) {
    choices.push({
      name: types[i],
      value: types[i].toLowerCase()
    })  
  }
  
  return {
    name: 'disable',
    description: 'Disables certian bot things',
    options: [
      {
          name: 'type',
          description: 'The type of thing to disable',
          type: 3,
          choices,
          required: true
      },
      {
        name: 'thing',
        description: 'The thing to disable',
        type: 3,
        autocomplete: true,
        required: true
      }
    ]  
  }
}

export default DisableInteraction;
