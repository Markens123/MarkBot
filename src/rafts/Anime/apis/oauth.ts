import BaseAPI from '../../BaseAPI.js';

class OauthAPI extends BaseAPI {
  constructor(raft) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.MAL_CLIENT_ID);
    const apiConfig = {
      baseURL: 'https://myanimelist.net/v1/oauth2/token',
    };
    super(raft, apiConfig);
  }

  /**
   * Gets the token froma code
   * @param {string} [code] The code used to get the token
   * @returns {Promise<Object>}
   */
  getToken(code) {
    const path = this.api;
    const params = new URLSearchParams();
    params.append('client_id', process.env.MAL_CLIENT_ID);
    params.append('client_secret', process.env.MAL_CLIENT_SECRET);
    params.append('code', code);
    params.append('code_verifier', process.env.MAL_CODE_VERIFIER);
    params.append('grant_type', 'authorization_code');

    return path
      .post({ data: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .then(res => res.data)
      .catch(err => err);
  }

  /**
   * Refreshes an expired token
   * @param {string} [rtoken] The refresh token
   * @returns {Promise<Object>}
   */
  refreshToken(rtoken) {
    const path = this.api;
    const params = new URLSearchParams();
    params.append('client_id', process.env.MAL_CLIENT_ID);
    params.append('client_secret', process.env.MAL_CLIENT_SECRET);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', rtoken);

    return path
      .post({ data: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .then(res => res.data)
      .catch(err => err);
  }
}

export default OauthAPI;
