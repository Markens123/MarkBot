import axios from 'axios';
import FormData from 'form-data';
import { DriveResponse } from '../../../../lib/interfaces/Main.js';

class DriveAPI {
  api = axios.create({
    baseURL: "https://files.markens.me/api/",
    headers: {
      'x-api-key': process.env.FILE_API_KEY
    }
  });

  async uploadFile(url: string): Promise<DriveResponse | null> {
    try {
      const response = await axios.get(url, {
        responseType: 'stream'
      });

      const formData = new FormData();
      formData.append('stream', response.data, { filename: 'skin.png' });

      const uploadResponse = await this.api.post('/upload', formData, {
        headers: {
          ...formData.getHeaders() 
        }
      });

      return uploadResponse.data
    } catch(error) {
      return null
    }
  }
}

export default DriveAPI;