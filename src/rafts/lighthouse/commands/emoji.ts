import { Message } from 'discord.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import BaseCommand from '../../BaseCommand.js';
import isImageUrl from 'is-image-url';
import { YesNo } from '../../../util/Buttons.js'

class EmojiCommand extends BaseCommand {
  constructor(raft) {
    const options: CommandOptions = {
      name: 'emoji',
      owner: false,
      enabled: true,
    };
    super(raft, options);
  }

  async run(message: Message, args: any) {
    let a = [];

    if (isImageUrl(args[0])) a.push(args[0]);
    
    if (message.attachments.size > 0) {
      message.attachments.forEach(i => {
        if (i.contentType?.includes('image')) a.push(i.url);
      });
    }
    if (message.embeds.length > 0) {
      message.embeds.forEach(async i => {
        if (isImageUrl(i.url)) a.push(i.url)
        if (i.image) a.push(i.image.url)
        if (i.thumbnail) a.push(i.thumbnail.url)
      })
    }
    a = [...new Set(a)]

    if (!a.length) return message.channel.send('You must provide an attachment!')

    if (args[0] === 'random') {
      for (let i = 0; i < a.length; i++) {
        args[i] = makeName(5)
      }
    }

    const resp = await YesNo({ message, content: 'Are you sure that you want to make these attachments into emojis?' })

    if (!resp) return;

    for (let i = 0; i < a.length; i++) {
      message.guild.emojis.create({attachment: a[i], name: args[i] ?? a[i].split('/').pop().split('#')[0].split('?')[0].match(/([\w\d_-]*)\.?[^\\\/]*$/i)[1].match(/(.{1,32})/g)[0]}).catch((error): any => {
        this.boat.log.error('emoji command', error)
        return message.channel.send('An error has occured')
      })
    }
  }
}

function makeName(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

export default EmojiCommand;
