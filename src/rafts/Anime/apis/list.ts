import BaseAPI from '../../BaseAPI.js';
class ListAPI extends BaseAPI {
  constructor(raft) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.MAL_CLIENT_ID);
    const apiConfig = {
      baseURL: 'https://api.myanimelist.net/v2/',
    };
    super(raft, apiConfig);
  }

  /**
   * Gets the list from the paramters
   * @param {string} [token] The access token
   * @param {string} [sort] The sort option
   * @param {string} [status] The status filter option
   * @param {boolean} [nsfw] Does the channel allow nsfw content
   * @returns {Promise<Object>}
   */
  async getList(token: string, sort: string, status: string, nsfw: boolean = false): Promise<object> {
    const url = 
      `https://api.myanimelist.net/v2/users/@me/animelist?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes&limit=100&sort=${sort}
        ${status ? `&status=${status}` : ''}
        ${nsfw ? '&nsfw=true' : '&nsfw=false'}`;
    this.driver.defaults.baseURL = url;

    let data: any = {};

    return this.api
      .get({ headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        data = res.data;
        if (!(res.data.paging && Object.keys(res.data.paging).length === 0 && res.data.paging.constructor === Object)) {
          if (res.data.paging.next) {
            let w = false;
            while (w === false) {
              let req = await this.getPage({token, url: res.data.paging.next}) as any;
              req = req.data;
              data.data = data.data.concat(req.data);
              res.data.paging.next = req.paging.next;
              if (req.paging.next) w = false;
              else w = true;
            }
          }
        }

        return data;
      })
      .catch(err => err);
  }
  
  /**
   * Gets a page from the provided url
   * @param {string} [token] The access token
   * @param {string} [url] The url of the page
   * @returns {Promise<Object>}
   */
  getPage({token, url, client = false}: {token?: string, url: string, client?: boolean}): Promise<object> {
    let headers = {}
    if (client) headers['X-MAL-CLIENT-ID'] = process.env.MAL_CLIENT_ID
    else headers['Authorization'] = `Bearer ${token}`;

    this.driver.defaults.baseURL = decodeURI(url);
    return this.api
      .get({ headers })
      .then(res => res)
      .catch(err => err);
  }

  /**
   * Searches for anime using the provided query
   * @param {string} [token] The access token
   * @param {string} [query] The query
   * @param {boolean} [nsfw] Does the channel allow nsfw content
   * @returns {Promise<Object>}
   */
  search({token, query, nsfw = false, client = false}: {token?: string, query: string, nsfw?: boolean, client?: boolean }): Promise<object> {
    const url = `https://api.myanimelist.net/v2/anime?q=${encodeURI(query)}&limit=100&fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes${nsfw ? '&nsfw=true' : '&nsfw=false'}`;
    this.driver.defaults.baseURL = url;
    let headers = {};
    if (client) headers['X-MAL-CLIENT-ID'] = process.env.MAL_CLIENT_ID
    else headers['Authorization'] = `Bearer ${token}`;

    let data: any = {};

    return this.api
      .get({ headers })
      .then(async res => {
        data = res.data;
        if (!(res.data.paging && Object.keys(res.data.paging).length === 0 && res.data.paging.constructor === Object)) {
          if (res.data.paging.next) {
            let w = false;
            let i = 0;
            while (w === false) {
              let req = await this.getPage({token, url: res.data.paging.next, client}) as any;
              req = req.data;
              data.data = data.data.concat(req.data);
              res.data.paging.next = req.paging.next;
              if (req.paging.next) w = false;
              else w = true;
              i++;
              if (i >= 2) w = true;  
            }
          }
        }

        return data;
      })
      .catch(err => err);
  }
  

  /**
   * Get's an anime using it's id
   * @param {string} [token] The access token
   * @param {string} [id] The anime's id
   * @returns {Promise<Object>}
   */
  getAnime({token, id, client = false}: {token: string, id: string, client: boolean}): Promise<object> {
    const url = `https://api.myanimelist.net/v2/anime/${id}?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes&nsfw=true`;
    this.driver.defaults.baseURL = url;
    let headers = {};
    if (client) headers['X-MAL-CLIENT-ID'] = process.env.MAL_CLIENT_ID
    else headers['Authorization'] = `Bearer ${token}`;

    return this.api
    .get({ headers })
    .then(res => res.data)
    .catch(err => err)
  }

}

export default ListAPI;
