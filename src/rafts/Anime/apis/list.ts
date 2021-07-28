'use strict';

import BaseAPI from '../../BaseAPI.js';

class ListAPI extends BaseAPI {
  constructor(raft) {
    const params = new URLSearchParams()
    params.append('client_id', process.env.MAL_CLIENT_ID);
    const apiConfig = {
      baseURL: 'https://api.myanimelist.net/v2/',
    };
    super(raft, apiConfig);
  }

  /**
   * Gets the token froma code 
   * @param {string} [code] The code used to get the token
   * @returns {Promise<Object>}
   */
  getToken(code) {
    let path = this.api.v1.oauth2.token
    const params = new URLSearchParams()
    params.append('client_id', process.env.MAL_CLIENT_ID);
    params.append('client_secret', process.env.MAL_CLIENT_SECRET);
    params.append('code', code);
    params.append('code_verifier', process.env.MAL_CODE_VERIFIER);
    params.append('grant_type', 'authorization_code');

    return path.post({data: params, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data).catch(err => err);
  }

  /**
   * Gets the list from the paramters 
   * @param {string} [token] The access token
   * @param {string} [sort] The sort option 
   * @param {string} [status] The status filter option  
   * @returns {Promise<Object>}
   */  
  getList(token, sort, status) {
    const params = encodeURI(`?fields=id,title,main_picture,synopsis,mean,rank,popularity,num_list_users,media_type,status,genres,my_list_status,num_episodes&sort=${sort}${status ? `&status=${status}` : ''}`)
    let path = this.api.users('@me').animelist
    return path.get({params: params, headers: {'Authorization': `Bearer ${token}`}}).then(res => res).catch(err => err);
  }

  getPage(token, url) {
    this.driver.defaults.baseURL = decodeURI(url)
    return this.api.get({headers: {'Authorization': `Bearer ${token}`}}).then(res => res).catch(err => err);
  }


}

export default ListAPI;

