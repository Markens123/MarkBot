import { promiseExec, clean } from '../../../util/Constants.js';
import { DateTime } from 'luxon'; 

class MinecraftAPI {
  async running(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec("sudo docker container inspect -f '{{.State.Running}}' bedrock-server").catch(() => {return {stdout: null, stderr: null }});
    if (!stdout && !stderr) return Promise.resolve(false);;
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.resolve(false);

    if (stdout == 'true') return Promise.resolve(true)
    else return Promise.resolve(false);
  }

  async uptime(): Promise<string> {
    if (await this.running() == false) return Promise.resolve('None');
    
    let { stdout, stderr } = await promiseExec("sudo docker container inspect -f '{{.State.StartedAt}}' bedrock-server").catch(() => {return {stdout: null, stderr: null }});
    if (!stdout && !stderr) return Promise.resolve('None');
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.resolve('None');
    
    let time = DateTime.fromISO(stdout).toRelative()
    
    return time ? Promise.resolve(time) : Promise.resolve('None')
  }

  async restart(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker restart bedrock-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else return Promise.resolve(true);
  }

  async start(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker start bedrock-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else return Promise.resolve(true);
  }

  async stop(): Promise<Boolean> {
    let { stdout, stderr } = await promiseExec('sudo docker stop bedrock-server').catch((err) => {return {stdout: null, stderr: err }});
    if (!stdout && !stderr) return Promise.reject(false);
    stdout = clean(stdout);
    stderr = clean(stderr);

    if (stderr) return Promise.reject(stderr)
    else return Promise.resolve(true);
  }
}

export default MinecraftAPI;