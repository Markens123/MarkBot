import { CommandInteraction } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';

class EnableInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'enable',
      guild: '816098833054302208',
      enabled: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: CommandInteraction) {
    if (!this.boat.owners.includes(interaction.user.id)) {
      this.boat.log.warn('#', `Non owner used enable command. Id: \`${interaction.user.id}\``)
      return interaction.reply({ content: 'no', ephemeral: true })
    }

    const type = interaction.options.get('type').value.toString().toLowerCase();
    const thing = interaction.options.get('thing').value.toString();
  
    let t: any;
    let tn: string;
    let reply: string;

    switch(type) {
      case 'command':
        t = this.boat.commands.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the command ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.command':
        t = this.boat.interactions.commands.get(thing)
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the slash command ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.autocomplete':
        t = this.boat.interactions.autocomplete.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the autocomplete interaction ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.message':
        t = this.boat.interactions.messageContextMenuComponents.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the message interaction ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.user':
        t = this.boat.interactions.userContextMenuComponents.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the user interaction ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.button':
        t = this.boat.interactions.buttonComponents.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the button interaction ${tn}`;
        t.enabled = true;
        break;

      case 'interaction.select':
        t = this.boat.interactions.selectMenuComponents.get(thing);
        tn = t.name;
        t.enabled ? reply = `${tn} is already enabled!` : reply = `You have succesfully enabled the select interaction ${tn}`;
        t.enabled = true;
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
    name: 'enable',
    description: 'Enables certian bot things',
    options: [
      {
          name: 'type',
          description: 'The type of thing to enable',
          type: 3,
          choices,
          required: true
      },
      {
        name: 'thing',
        description: 'The thing to enable',
        type: 3,
        autocomplete: true,
        required: true
      }
    ]  
  }
}

export default EnableInteraction;
