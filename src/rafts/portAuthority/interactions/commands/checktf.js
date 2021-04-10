'use strict';

const BaseInteraction = require('../../../BaseInteraction');
const getHTML = require('html-get');
const getHtmlTitle = require('vamtiger-get-html-title').default;
const { MessageEmbed, APIMessage } = require('discord.js');

const definition = {
  name: 'discordver',
  description: 'Checks the status of Discord TestFlight'
};

class CheckTFInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'checktf',
      guild: '274765646217216003',
      type: BaseInteraction.InteractionTypes.APPLICATION_COMMAND,
      enabled: true,      
      definition,
    };
    super(boat, info);
  }

  async run(interaction) {
    const client = this.boat.client;
    interaction.reply(`Checking TestFlight...`);
    let l = "https://testflight.apple.com/join/gdE4pRzI"
    const { html } = await getHTML(l)
    let title = getHtmlTitle({ html });
    title = title.slice(9).replace(' beta - TestFlight - Apple','');
    let embed = new MessageEmbed();
    embed.setTitle(title + " - TestFlight Status").setURL(l).setTimestamp();

    if(html.includes("This beta is full.")) embed.setDescription("Discord testflight is full!").setColor("FF0000");
    else embed.setDescription("Discord testflight has slots available!").setColor("7fff01");

    const apiMessage = APIMessage.create(interaction.webhook, null, embed).resolveData();
    this.boat.client.api.webhooks(this.boat.client.user.id, interaction.token).messages('@original').patch({ data: apiMessage.data });
  }
}

module.exports = CheckTFInteraction;
