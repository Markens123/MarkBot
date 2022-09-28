import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, Message, MessageActionRowComponentBuilder } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';

class UnlinkCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'unlink',
      owner: true,
      dms: 'only',
      enabled: true,
    };
    super(boat, options);
  }

  async run(message: Message) {
    const client = this.boat.client;

    if (!client.maldata.get(message.author.id)) return message.channel.send("Error you don't have an account to unlink.");

    const yes = new ButtonBuilder().setLabel('✅').setStyle(ButtonStyle.Success).setCustomId('collector:yes');
    const no = new ButtonBuilder().setLabel('❌').setStyle(ButtonStyle.Danger).setCustomId('collector:no');
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(yes, no)
    ]

   message.channel.send({ content: 'Are you sure that you want to unlink your account?', components }).then(msg => {
    
      const filter = (interaction) => interaction.user.id === message.author.id;

      msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time:60000 }).then(async (interaction: ButtonInteraction) => {
        if (interaction.customId.split(':')[1] === 'no') {
          await message.channel.messages.cache.get(msg.id)?.delete();
          interaction.reply({ content: "Great, your account won't be unlinked.", ephemeral: true });
        } else if (interaction.customId.split(':')[1] === 'yes') {

          client.maldata.delete(message.author.id);
          await message.channel.messages.cache.get(msg.id)?.delete();
          interaction.reply({ content: "Success, your account has been unlinked.", ephemeral: true });


        }
      
      }).catch(() => {
        message.channel.messages.cache.get(msg.id)?.delete();
      })
    
    });


  }
}

export default UnlinkCommand;
