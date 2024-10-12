
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import got from 'got';
import BaseInteraction from '../../../BaseInteraction.js';

class SkinInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'skin',
      enabled: true,
      guild: ['816098833054302208', '906198620813008896'],
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const boat = this.boat;
    const client = boat.client;
    let url = interaction.options.getString("url", true)
    const b64string = url.replaceAll("https://starlightskins.lunareclipse.studio/apps/skin-creator?skinCode=", "").replaceAll("%3D", "=").replaceAll("backgroundImage=", "");
    const buf = Buffer.from(b64string, 'base64').toString();
    
    await interaction.deferReply({ ephemeral: true })

    let { body } = await got(`https://starlightskins.lunareclipse.studio/dev-tools/skin-creator-code/${buf}`)
    
    let definedOptions = JSON.parse(body) 
    if (definedOptions.error != undefined) return interaction.editReply("An error has occured please try again.")

    let renderLink = `https://starlightskins.lunareclipse.studio/create-skin/${definedOptions.base_texture}/${definedOptions.base_color}/${definedOptions.skin_type}/?`;
    for (let index in definedOptions) {
      if (!["base_texture", "base_color", "skin_type"].includes(index)) {
        renderLink = renderLink + `${index}=${definedOptions[index]}&`;
      }
    };
    
    const resp = await client.driveApi.uploadFile(renderLink);
    if (resp === null) return interaction.editReply("An error has occured please try again.") 

    const embed = new EmbedBuilder()
      .setTitle("Command Generated")
      .setDescription(`\`\`\` /cs skin ${resp.url} \`\`\``)
      .setColor('Random')

      interaction.editReply({ embeds: [embed] })
  }
}

function getDefinition() {
  return new SlashCommandBuilder()
    .setName('skin')
    .setDescription('Generates a skin command from a skin code')
    .addStringOption(option => 
      option
      .setName("url")
      .setDescription("Url of the skin code")
      .setRequired(true)
    )
    .toJSON()
}

export default SkinInteraction;