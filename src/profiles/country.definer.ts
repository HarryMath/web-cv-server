import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CountryDefiner {
  private readonly apiKey = process.env.IP_API_KEY;
  private readonly endpoint = 'http://api.ipapi.com/api/';
  private readonly logger = new Logger(CountryDefiner.name);

  public async getCountry(ip: string): Promise<{country: string, city: string}> {
    const res = await axios.get(this.endpoint + ip + '?access_key=' + this.apiKey);
    if (res.status != 200) {
      this.logger.error('ip-api returned non 200 code: ' + res.status);
      this.logger.error(res.data);
    }
    const country = res.data.country_name;
    const city = res.data.city;
    if (!country) {
      this.logger.error('ip-api returned bad response: ', res.data);
    }
    return {country, city};
  }
}
