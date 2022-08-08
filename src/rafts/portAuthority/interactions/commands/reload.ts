import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { RaftI } from '../../../../../lib/interfaces/Main.js';
import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ReloadInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'reload',
      guild: '816098833054302208',
      enabled: true,
      definition: getDefinition(),
    };
    super(raft, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    if (!this.boat.owners.includes(interaction.user.id)) {
      this.boat.log.warn('#', `Non owner used reload command. Id: \`${interaction.user.id}\``)
      return interaction.reply({ content: 'no', ephemeral: true })
    }
    const client = this.boat.client;
    const type = interaction.options.get('type').value.toString().toLowerCase();
    const thing = interaction.options.get('thing').value.toString();
    const options = {
      cwd: `${this.boat.options.basepath}/rafts`,
      realpath: true
    };    
    let path: string;
    let raft: RaftI;
    let t: any;
    let tn: string;
    let loc: any;
    let bloc: any;
    let reply: string;

    switch(type) {
      case 'command':
        t = this.boat.commands.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/commands/${tn}.js`, options)[0];
        loc = raft.commands;
        bloc = this.boat.commands;
        reply = `You have succesfully reloaded the command ${tn}`
        break;

      case 'interaction.command':
        t = this.boat.interactions.commands.get(thing)
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/commands/${tn}.js`, options)[0];
        loc = raft.interactions.commands;
        bloc = this.boat.interactions.commands;
        reply = `You have succesfully reloaded the slash command ${tn}`
        break;

      case 'interaction.autocomplete':
        t = this.boat.interactions.autocomplete.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/autocomplete/${tn}.js`, options)[0];
        loc = raft.interactions.autocomplete;
        bloc = this.boat.interactions.autocomplete;
        reply = `You have succesfully reloaded the autocomplete interaction ${tn}`
        break;

      case 'interaction.message':
        t = this.boat.interactions.messageContextMenuComponents.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/contextMenuComponents/messages/${tn}.js`, options)[0];
        loc = raft.interactions.messageContextMenuComponents;
        bloc = this.boat.interactions.messageContextMenuComponents;
        reply = `You have succesfully reloaded the message interaction ${tn}`
        break;

      case 'interaction.user':
        t = this.boat.interactions.userContextMenuComponents.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/contextMenuComponents/users/${tn}.js`, options)[0];
        loc = raft.interactions.userContextMenuComponents;
        bloc = this.boat.interactions.userContextMenuComponents;
        reply = `You have succesfully reloaded the user interaction ${tn}`
        break;

      case 'interaction.button':
        t = this.boat.interactions.buttonComponents.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/buttonComponents/${tn}.js`, options)[0];
        loc = raft.interactions.buttonComponents;
        bloc = this.boat.interactions.buttonComponents;
        reply = `You have succesfully reloaded the button interaction ${tn}`
        break;

      case 'interaction.select':
        t = this.boat.interactions.selectMenuComponents.get(thing);
        tn = t.name;
        raft = t.raft;
        path = glob.sync(`**/interactions/selectMenuComponents/${tn}.js`, options)[0];
        loc = raft.interactions.selectMenuComponents;
        bloc = this.boat.interactions.selectMenuComponents;
        reply = `You have succesfully reloaded the select interaction ${tn}`
        break;

      case 'api':
        const keys = Object.keys(this.boat.rafts);
        keys.forEach(x => {
          if (this.boat.rafts[x].apis) {
            if (Object.keys(this.boat.rafts[x].apis).includes(thing)) raft = this.boat.rafts[x]
          }
        }); 
        tn = thing;
        path = glob.sync(`**/apis/${tn}.js`, options)[0];
        loc = raft.apis;
        bloc = null;
        reply = `You have succesfully reloaded the ${tn} api`
        break;

      case 'event':
        tn = thing;
        bloc = this.boat.events;
        break;

      case 'raft':
        tn = thing;
        break;
      default:
        return interaction.reply({ content: 'Invalid type!', ephemeral: true })
    } 

    if (type === 'raft') {
      try {
        const raft = (await import(`${this.boat.options.basepath}/rafts/index.js?id=${Math.random().toString(36).substring(3)}`)).default[tn];
        this.boat.launchRaft(raft, tn);

        return interaction.reply({ content: `You have succesfully reloaded the raft ${tn}.`, ephemeral: true })

      } catch(error) {
        this.boat.log.error(__filename, error);
        return interaction.reply({ content: 'An error has occured!', ephemeral: true });
      }
    }

    if (type === 'event') {
      try {
        client.removeAllListeners(tn)
        const event = (await import(`${this.boat.options.basepath}/events/index.js?id=${Math.random().toString(36).substring(3)}`)).default[tn];
        this.boat.events[tn] = event;

        this.boat.listen(tn, event)

        return interaction.reply({ content: `You have succesfully reloaded the ${tn} event.`, ephemeral: true })
      } catch(error) {
        this.boat.log.error(__filename, error);
        return interaction.reply({ content: 'An error has occured!', ephemeral: true });
      }
    }

    try {
      const command = (await import(`file:///${path}?id=${Math.random().toString(36).substring(3)}`)).default;
        
      loc.set(tn, new command(raft));
      
      !bloc ? null : bloc.set(tn, loc.get(tn));
      
      interaction.reply({ content: reply, ephemeral: true });
    } catch(error) {
      this.boat.log.error(__filename, error);
      interaction.reply({ content: 'An error has occured!', ephemeral: true });
    }
    
  }
}

function getDefinition() {
  const choices = [];
  const types = ['Raft', 'Command', 'Interaction.Command', 'Interaction.Autocomplete', 'Interaction.Message', 'Interaction.User', 'Interaction.Button', 'Interaction.Select', 'Api', 'Event']
  
  for (let i = 0; i < types.length; i++) {
    choices.push({
      name: types[i],
      value: types[i].toLowerCase()
    })  
  }

  return new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads certian bot things')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of thing to reload')
        .addChoices(...choices)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('thing')
        .setDescription('The thing to reload')
        .setAutocomplete(true)
        .setRequired(true)
    )
    .toJSON();
}

export default ReloadInteraction;
