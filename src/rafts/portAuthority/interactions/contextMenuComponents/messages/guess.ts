import { ButtonInteraction, ComponentType, ContextMenuCommandInteraction, EmbedBuilder, Message, Snowflake, SnowflakeUtil } from 'discord.js';
import { BoatI } from '../../../../../../lib/interfaces/Main.js';
import Identify from '../../../../../util/Identify.js';
import BaseInteraction from '../../../../BaseInteraction.js';
class GuessInteraction extends BaseInteraction {
  constructor(raft) {
    const info = {
      name: 'Guess',
      enabled: true,
      type: 'MESSAGE',
    };
    super(raft, info);
  }

  async run(interaction: ContextMenuCommandInteraction) {
    const message = interaction.options.getMessage('message') as Message;
    let url = '';
    let a = [];

    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType?.includes('image')) a.push(i.url);
      });
    }
    if (message.embeds.length > 0) {
      message.embeds.forEach(async i => {
        if (testImage(i.url)) a.push(i.url)
        if (i.image) a.push(i.image.url)
        if (i.thumbnail) a.push(i.thumbnail.url)
      })
    }
    a = [...new Set(a)]
    
    if (a.length === 1) url = a[0];
    else if (a.length > 0) {
      const code = SnowflakeUtil.generate();
      const components = genButtons(a.length, this.boat, code.toString());
      const filter = i => i.user.id === interaction.user.id && i.customId.split(':')[2] === code;

      await interaction.reply({ content: `There are ${a.length} valid images on that message. Which image would you like to use?`, components });
      const col = await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 5000 }).catch(err => err) as ButtonInteraction;
      if (!(col instanceof Error)) {
        url = a[col.customId.split(':')[1]];
        col.deferUpdate();
        message.channel.messages.cache.get(col.message.id)?.edit({ content: 'Loading Data <a:Loading:400844245105246230>', components: [] })
      } else return;
    }

    if (!url) return interaction.reply({ content: 'Please use this on a message with an image attachment!', ephemeral: true });

    if (!interaction.replied) await interaction.reply('Loading Data <a:Loading:400844245105246230>');

    return processImage(interaction, url, this.boat)

  }
}


function genButtons(num: number, boat: BoatI, code: Snowflake) {
  if (num > 10) {
    boat.log.warn('Guess interaction/Gen Buttons function', 'The provided number was over 10');
    num = 10;
  }

  const a = [];

  for (let i = 0; i < num; i++) {
    a.push({
      type: 'BUTTON',
      label: i + 1,
      customId: `collector:${i}:${code}`,
      style: 'PRIMARY',
      emoji: null,
      url: null,
      disabled: false,
    });
  }
  // @ts-expect-error chunk isn't defined so ye
  return a.chunkc(5);
}

function testImage(url) {
  return(url?.match(/\.(jpeg|jpg|webp|png)$/) != null);
}

function processImage(interaction, url, boat) {
  Identify(boat, url, (output) => {
    if (!output.toString().includes("|")) {
      interaction.editReply({ content: 'An internal error occurred', ephemeral: true });
      return boat.log.error('Image processing (guess.ts)', output)
    }

    let stdout = output.split('|');
    let guess = stdout[0].replace(/(\r\n|\n|\r)/gm, '');
    let confidence = stdout[1].replace(/(\r\n|\n|\r)/gm, '');

    let embed = new EmbedBuilder()
      .setTitle('Neural Network Guess')
      .setURL('https://github.com/Pabszito/NNTwitterBot')
      .setDescription(`My best guess for the following image is \`${guess}\`, with a confidence of about \`${confidence}\`.`)
      .setImage(url)
      .setColor('Random') 
      .setFooter({text: 'Original twitter bot by riscmkv, code by Pabszito#1158, stolen by Markens'})

    interaction.editReply({ content: null, embeds: [embed], components: [] })
  });
}


export default GuessInteraction;
