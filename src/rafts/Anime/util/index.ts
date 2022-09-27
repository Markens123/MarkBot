import { ColorResolvable, CommandInteraction, EmbedBuilder, Message } from "discord.js";

export const genEmbedI = (data, interaction: CommandInteraction, offset: number, client: boolean = false) => {
  const anime = data.data[offset].node;

  const synopsis = anime.synopsis.length >= 1021 ? `${anime.synopsis.substring(0, 1021)}...` : anime.synopsis;
  if (!anime.my_list_status) {
    anime.my_list_status = {};
    anime.my_list_status.status = 'not_watched';
    anime.my_list_status.score = 0;
    anime.my_list_status.num_episodes_watched = 0;
  }

  if (client) {
    return new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor('Random')
    .setTitle(anime.title)
    .setURL(`https://myanimelist.net/anime/${anime.id}`)
    .setThumbnail(anime.main_picture.medium)
    .setFooter({ text: `${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${anime.genres.map(a => a.name).join(', ')}` })
    .addFields([
      {
        name: 'Info',
        value: `**Score** ${anime.mean}\n**Ranked** ${anime.rank ? `#${anime.rank}` : 'N/A'}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(
          anime.num_list_users,
        ).toLocaleString('en-US')}`,
      },
      { name: 'Synopsis', value: synopsis }
    ]);    
  }

  return new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(genColor(anime.my_list_status.status))
    .setTitle(anime.title)
    .setURL(`https://myanimelist.net/anime/${anime.id}`)
    .setThumbnail(anime.main_picture.medium)
    .setFooter({ text: `${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${anime.genres.map(a => a.name).join(', ')}` })
    .addFields([
      { name: 'Status', value: hreadable(anime.my_list_status.status) },
      { name: 'Score given', value: genScore(anime.my_list_status.score) },
      {
        name: 'Info',
        value: `**Score** ${anime.mean}\n**Ranked** ${anime.rank ? `#${anime.rank}` : 'N/A'}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(
          anime.num_list_users,
        ).toLocaleString('en-US')}\n **Episodes watched** ${anime.my_list_status.num_episodes_watched}/${anime.num_episodes}`,
      },
      { name: 'Synopsis', value: synopsis }
    ]);
}

export const genEmbed = (data, message: Message, offset: number) => {
  const anime = data.data[offset].node;

  const synopsis = anime.synopsis.length >= 1021 ? `${anime.synopsis.substring(0, 1021)}...` : anime.synopsis;
  if (!anime.my_list_status) {
    anime.my_list_status = {};
    anime.my_list_status.status = 'not_watched';
    anime.my_list_status.score = 0;
    anime.my_list_status.num_episodes_watched = 0;
  }

  return new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(genColor(anime.my_list_status.status))
    .setTitle(anime.title)
    .setURL(`https://myanimelist.net/anime/${anime.id}`)
    .setThumbnail(anime.main_picture.medium)
    .setFooter({ text: `${offset + 1}/${data.data.length} • ${anime.media_type} ${hreadable(anime.status)} • ${anime.genres.map(a => a.name).join(', ')}` })
    .addFields([
      { name: 'Status', value: hreadable(anime.my_list_status.status) },
      { name: 'Score given', value: genScore(anime.my_list_status.score) },
      {
        name: 'Info',
        value: `**Score** ${anime.mean}\n**Ranked** ${anime.rank ? `#${anime.rank}` : 'N/A'}\n**Popularity** #${anime.popularity}\n**Members** ${parseInt(
          anime.num_list_users,
        ).toLocaleString('en-US')}\n **Episodes watched** ${anime.my_list_status.num_episodes_watched}/${anime.num_episodes}`,
      },
      { name: 'Synopsis', value: synopsis }
    ]);
}


export const hreadable = (text) => {
  const str = text.split('_').join(' ');
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export const genScore = (score) => {
  if (score == 0) return 'None given';
  if (score == 1) return '1 (Appalling)';
  if (score == 2) return '2 (Horrible)';
  if (score == 3) return '3 (Very Bad)';
  if (score == 4) return '4 (Bad)';
  if (score == 5) return '5 (Average)';
  if (score == 6) return '6 (Fine)';
  if (score == 7) return '7 (Good)';
  if (score == 8) return '8 (Very Good)';
  if (score == 9) return '9 (Great)';
  if (score == 10) return '10 (Masterpiece)';
}

export const genColor = (status: string): ColorResolvable => {
  if (status === 'watching') return '#32CD32';
  if (status === 'completed') return '#000080';
  if (status === 'on_hold') return '#E7B715';
  if (status === 'dropped') return '#A12F31';
  if (status === 'plan_to_watch') return '#8F8F8F';
  return '#000001';
}