import { ChatInputCommandInteraction } from 'discord.js';
import { util } from '../../../../../util/index.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import { stringToJSON } from '../../../../../util/Constants.js';
import glob from 'glob';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FunctionsDeployInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'deploy',
      owner: true,
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const name = interaction.options.getString('name');
    const path = interaction.options.getString('path');
    const flags = interaction.options.getString('flags', false) ?? '';
    const build = interaction.options.getBoolean('build', false);
    const env = interaction.options.getBoolean('env', false);
    const github = interaction.options.getString('github', false);
    const project = interaction.options.getAttachment('project', false);

    interaction.deferReply({ephemeral: true})

    if (!github && !project) {
      return interaction.editReply({ content: 'You must enter a github url or upload a project' })
    }

    if (github && project) {
      return interaction.editReply({ content: "You can't have both a github url and a project",  })
    }

    console.log({ name, path, flags, github, project, __dirname })

    if (github) {
      let { stderr: gherr } = await util.promiseExec(`git clone ${github} pj-functions/${name}`)
        .catch(() => {
          return {stderr: 'ERROR'}
        });
        console.log(gherr)
      if (gherr === 'ERROR') return interaction.editReply({ content: this.errors.gh });

      if (build) {
        let { stderr: builderr } = await util.promiseExec(`cd pj-functions/${name} && npm run build`)
          .catch(() => {
            return {stderr: 'ERROR'}
          });
          console.log(builderr)

        if (builderr) return interaction.editReply({ content: this.errors.build, });
      }

      
      if (env) {
        const envtxt = readFile(`pj-functions/${name}/.env.example`);
        console.log(envtxt)
        if (envtxt instanceof SyntaxError) {
          return interaction.editReply({ content: this.errors.env });
        } else {
          const envdata = envtxt.replaceAll('\n', '').split('=').filter(Boolean);
          
        }
      }

      return interaction.editReply('t')

      let { stdout: startout, stderr: starterr } = await util.promiseExec(`pm2 start --name ${name} ${path} ${flags}`)
      .catch(() => {
        interaction.editReply({ content: this.errors.start });
        return {stdout: null, stderr: 'ERROR'}
      });

      console.log(starterr)
      
      if (starterr) return interaction.editReply({ content: this.errors.build });
      if (startout) {
        return interaction.editReply('Project ran!');
      }
    } else return
    interaction.editReply({ content: 'No' })
  }

  errors = {
    gh: 'An error has occured while pulling the git repo (make sure it exists/is public)',
    build: "An error has occured while building the project (make sure there's a build script in package.json)",
    start: 'An error has occured while starting the function!',
    env: "An error has occured while generating the env (make sure there's an .env.example file)"
  }
}

function readFile(path) {
  const options = {
    cwd: `${__dirname}../../../../../../../../`,
    realpath: true,
  };

  const filepath = glob.sync(path, options)[0];

  if (!filepath) return new SyntaxError('That file does not exist');

  const file = fs.readFileSync(filepath, { encoding: 'utf8' });

  return file;
}

export default FunctionsDeployInteraction;
