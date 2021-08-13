import { Collection } from 'discord.js';
import BaseAPI from '../../BaseAPI.js';

const fourHours = 4 * 60 * 60 * 1000;

class NasaAPI extends BaseAPI {
  constructor(raft) {
    const apiConfig = {
      baseURL: 'https://api.nasa.gov',
      params: {
        api_key: raft.boat.options.tokens.nasa,
      },
    };
    super(raft, apiConfig);

    /**
     * The cache for any data this api accesses
     * @type {Collection<string, Object>}
     */
    this.cache = new Collection();
  }

  /**
   * Get the APOD data for the day
   * @param {boolean} [force=false] Whether to skip the cache check
   * @returns {Promise<Object>}
   */
  async getAPOD(force = false) {
    const cached = this.cache.get('APOD');
    if (!force && cached && Date.now() < cached.timestamp + fourHours) {
      return cached;
    }
    const res = await this.api.planetary.apod.get();
    const data = res.data;
    data.timestamp = new Date(res.headers.date).getTime();
    this.cache.set('APOD', data);
    return this.cache.get('APOD');
  }
}

export default NasaAPI;
