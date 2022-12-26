import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import BaseInteraction from '../../../../BaseInteraction.js';
import AnimeAPI from '../../../apis/anime.js';

class AAlertsConfigInteraction extends BaseInteraction {
  constructor(boat) {
    const info = {
      name: 'config',
      enabled: true,
    };
    super(boat, info);
  }

  async run(interaction: ChatInputCommandInteraction) {
    const client = this.boat.client;
    const alerts = await client.animealerts.get(interaction.guild.id);
    const api = new AnimeAPI();

    await interaction.deferReply();

    const ids: string[] = alerts.animes;
    let info: { id: string, title: string, mentions: string[] }[] = [];

    for (let i = 0; i < ids.length; i++) {
      const anime = await api.getAnime(ids[i]);
      if (anime) {
        info.push({
          id: ids[i],
          title: anime.title,
          mentions: alerts.mentions[ids[i]]
        })
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('AnimeAlerts Config')
      .addFields(info.map(x => {
        const mentions = x.mentions ? `mentions: ${x.mentions.join(' ')}` : '';
        return {
          name: x.title, 
          value: `id: \`${x.id}\`\n${mentions}`
        }
      }));

    return interaction.editReply({ embeds: [embed] });
  }
}

export default AAlertsConfigInteraction;
