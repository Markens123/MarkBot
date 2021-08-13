import BaseAPI from '../../BaseAPI.js';

class DogAPI extends BaseAPI {
  constructor(raft) {
    const apiConfig = {
      baseURL: 'https://dog.ceo/api',
    };
    super(raft, apiConfig);
  }

  /**
   * Gets a random image of a pupper
   * @param {string} [breed] The breed to get a random image of
   * @param {string} [subbreed] The subbreed to get a random image of
   * @returns {Promise<Object>}
   */
  getRandom(breed, subbreed) {
    let path = this.api.breeds.image.random;
    if (breed) {
      path = this.api.breed(breed);
      if (subbreed) path = path(subbreed);
      path = path.images.random;
    }
    return path.get().then(res => res.data);
  }

  /**
   * Get a list of all available breeds
   * @returns {Promise<string[]>}
   */
  async getBreeds() {
    const breeds = await this.api.breeds.list.all.get();
    if (!breeds) return null;
    return Object.keys(breeds.data?.message);
  }
}

export default DogAPI;
