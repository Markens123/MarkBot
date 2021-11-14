import { Message } from 'discord.js';
import BaseCommand from '../../BaseCommand.js';
import { CommandOptions } from '../../../../lib/interfaces/Main.js';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import https from 'https';
import fs from 'fs';
import { DownloaderHelper } from 'node-downloader-helper';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ffmpeg.setFfmpegPath(ffmpegPath.path)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class CutCommand extends BaseCommand {
  constructor(boat) {
    const options: CommandOptions = {
      name: 'cut',
      owner: true,
      enabled: true,
      args: [
        {
          name: 'name',
          type: 'flag',
          index: 1,
          flags: ['--name', '-n'],
          default: 'video_out.mp4'

        },
        {
          name: 'st',
          type: 'string',
          required: true
        },
        {
          name: 'dt',
          type: 'string',
          required: true
        },
      ]
    };
    super(boat, options);
  }

  async run(message: Message, args: any) {
    if (!message.attachments.first()?.contentType.includes('video')) return message.channel.send('Please use a video attachment!')
    const url = message.attachments.first().url;

    const dl = new DownloaderHelper(url , __dirname, { fileName: 'out.mp4' });
  
    dl.on('end', () => {
    
      this.boat.log(__dirname, 'Download Completed')
      
      ffmpeg('out.mp4')
      .setStartTime(args.st)
      .setDuration(args.dt)
      .output(args.name)
      .on('end', (err) => {
        if (!err) console.log('Clipping Done')
            
        fs.unlink('./out.mp4', (err) => {
          if (err) {
            console.error(err)
            return
          }
        }) 
      })
        
      .on('error', (err) => {
          
        console.log('error: ', err)
        
        fs.unlink('./out.mp4', (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
      }).run()
      
    })   
    dl.start();

    await delay(10000)

    await message.channel.send({ files: [`./${args.name}`] })

    fs.unlink(`./${args.name}`, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
}

export default CutCommand;
