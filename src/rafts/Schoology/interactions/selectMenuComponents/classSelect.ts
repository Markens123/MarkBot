import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel, ThreadManager } from 'discord.js';
import { CommandOptions } from '../../../../../lib/interfaces/Main.js';
import messageCreate from '../../../../events/messageCreate.js';
import { ComponentFunctions } from '../../../../util/Constants.js';

import BaseInteraction from  '../../../BaseInteraction.js';

class SelectClassInteraction extends BaseInteraction {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'SELECT_CLASS',
      enabled: true,
    };
    super(raft, options);
    this.definition = this.generateDefinition.bind(this);
  }

  async run(interaction: SelectMenuInteraction) {
    // class: interaction.values[0]
    const client = this.boat.client;
    const data = interaction.customId.split(':').slice(1);
    const classes = {math: 'Algebra', english: 'English', wh: 'World History', gym: 'Gym', spanish: 'Spanish', poe: 'Principles of Engineering', wd: 'Website Development', mc: 'Modern Chemistry'};
    if (interaction.channel.id !== '883882042532700190' 
      || interaction.channel.type !== 'GUILD_TEXT' 
      || !Object.keys(classes).includes(interaction.values[0])
      || !client.schoold.has(data[0])
    ) return interaction.reply({ content: "Well this shouldn't be happening", ephemeral: true });
    

    const assignment = client.schoold.get(data[0])
    
    let channel = await interaction.channel.threads.create({
      name: assignment.title,
      autoArchiveDuration: 'MAX',
    })

    channel.members.add('396726969544343554')

    client.schoold.set(data[0], channel.id, 'id')
    client.schoold.set(data[0], interaction.values[0], 'class')

    interaction.channel.messages.cache.get(interaction.message.id).delete().catch(() => {});

    const embed = new MessageEmbed()
    .setTitle(`${classes[interaction.values[0]]} Assignment`)
    .addField(assignment.title, assignment.description)
    .setColor('AQUA')
    .setURL(assignment.url);

    channel.send({ embeds: [embed] })

  }

  generateDefinition(id) {
    const customId = `${ComponentFunctions[this.name]}:${id}`;
    return new MessageActionRow({
      components: [
        new MessageSelectMenu()
          .setCustomId(customId)
          .setPlaceholder('None')
          .setMaxValues(1)
          .addOptions([
            {
              label: 'Algebra',
              value: 'math',  
            },
            {
              label: 'English',
              value: 'english',
            },
            {
              label: 'World History',
              value: 'wh',
            },
            {
              label: 'Gym',
              value: 'gym',
            },
            {
              label: 'Spanish',
              value: 'spanish',
            },
            {
              label: 'Principles of Engineering',
              value: 'poe',
            },
            {
              label: 'Website Development',
              value: 'wd',
            },
            {
              label: 'Modern Chemistry',
              value: 'mc',
            }              
          ])
      ],
    });
  }  
}

export default SelectClassInteraction;