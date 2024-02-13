import { TextBasedChannel, TextChannel } from 'discord.js';
import { promiseExec, clean } from '../../../util/Constants.js';
import { DateTime } from 'luxon'; 

class PalworldAPI {
  async running(channel?: TextBasedChannel): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec("sudo docker container inspect -f '{{.State.Running}}' palworld-server").catch(() => {return {stdout: null, stderr: null }});
    if (!stdout && !stderr) return Promise.resolve(false);;
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (channel) channel.send({ content: stdout })

    if (channel) channel.send({ content: stderr })

    if (stderr) return Promise.resolve(false);

    if (stdout == 'true') return Promise.resolve(true)
    else Promise.resolve(false);
  }

  async uptime(): Promise<String> {
    if (await this.running() == false) return Promise.resolve('None');
    
    let { stdout, stderr } = await promiseExec("sudo docker container inspect -f '{{.State.StartedAt}}' palworld-server").catch(() => {return {stdout: null, stderr: null }});
    if (!stdout && !stderr) return Promise.resolve('None');
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.resolve('None');
    
    let time = DateTime.fromISO(stdout).toRelative()
    
    return time ? Promise.resolve(time) : Promise.resolve('None')
  }

  async restart(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker restart palworld-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else Promise.resolve(true);
  }

  async start(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker start palworld-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else Promise.resolve(true);
  }

  async stop(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker stop palworld-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else Promise.resolve(true);
  }

  async backup(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker exec palworld-server backup').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else Promise.resolve(true);
  }
}

export default PalworldAPI;