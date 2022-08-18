import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageParser {

  async getCompanyLogo(companyName: string): Promise<string|null> {
    // TODO add caching by name
    if (companyName.length < 2) {
      return null;
    }
    return await this.parseImage(companyName + ' logo');
  }

  async parseImage(keyWord: string, attempt = 1): Promise<string|null> {
    try {
      const url = `https://google.com/search?q=${keyWord}&tbm=isch`;
      const response = await axios.get(url);
      const possibleImages = response.data
        .replace('\n', '')
        .split('class="GpQGbf"')[1]
        .split('src="')
        .map(i => i.split('"')[0]);
      const image = possibleImages.find(i => i?.startsWith('https://'));
      return image ? image : null;
    } catch (ignore) {
      console.log(`[parseImage] attempt ${attempt} failed.`);
      if (attempt > 2) {
        return null;
      }
      return this.parseImage(keyWord, attempt + 1);
    }
  }
}
