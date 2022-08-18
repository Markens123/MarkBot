import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import BaseInteraction from '../../../BaseInteraction.js';
import { ocrSpace } from 'ocr-space-api-wrapper';

class OCRInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'ocr',
      enabled: true,
			guild: '816098833054302208',
      definition: getDefinition(),
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
	  const attachment = interaction.options.getAttachment('attachment');
    const boat = this.boat;
    interaction.deferReply({ ephemeral: true });

    if (!boat.options.tokens.ocr) {
      boat.log.error('Interactions/OCR', 'OCR Token not provided!!')
      return interaction.editReply('An internal error has occured please contact the bot owner.')
    }

    
    const req = await ocrSpace(attachment.url, { apiKey: boat.options.tokens.ocr })

    return interaction.editReply('Nothing to see here...');

    const obj = toObj(req.data.text.trim());

    console.log(obj);
    console.log(req.data.text.trim())

    if (!obj.cashier || !obj.money_earned) {
      return interaction.editReply({ content: 'Error no cashier/money earned provided in image!' })
    }

    interaction.editReply({ content: `The cashier is ${obj.cashier} and they earned ${obj.money_earned}` })

	}
}

function toObj(text: string): any {
  return text.split("\n").reduce(function(obj, str) {
    let strParts = str.split(":");
    if (strParts[0] && strParts[1]) {
      obj[strParts[0].replace(/\s+/g, '_').toLowerCase()] = strParts[1].trim();
    }
    return obj;
  }, {});
}

function getDefinition() {
  return new SlashCommandBuilder()
		.setName('ocr')
    .setDescription('Analyze image and try to return an object from it')
		.addAttachmentOption(option =>
			option
				.setName('attachment')
				.setDescription('The attachment')
				.setRequired(true)	
		)
    .toJSON()
}

export default OCRInteraction;
