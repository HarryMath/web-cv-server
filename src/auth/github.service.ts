import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {

  private readonly id = process.env.GITHUB_ID || '';
  private readonly secret = process.env.GITHUB_SECRET || '';

  async getToken(code: string): Promise<string> {
    const body = {
      code,
      'client_id': this.id,
      'client_secret': this.secret
    };
    const headers = {Accept: 'application/json'};
    const res = await axios.post(
      'https://github.com/login/oauth/access_token',
      body,
      {headers}
    );
    if (res.status > 299 || !res.data.access_token) {
      throw new ForbiddenException('github token not received. status' + res.status);
    }
    return res.data.access_token;
  }

  async getUserData(token: string): Promise<any> {
    const headers = {
      Accept: 'application/json',
      Authorization: 'token ' + token
    };
    const res = await axios.get('https://api.github.com/user', {headers});
    if (res.status > 299) {
      throw new ForbiddenException('github user data not received. status ' + res.status);
    }
    return res.data;

  }

  async getEmail(token: string): Promise<string> {
    const headers = {
      Accept: 'application/json',
      Authorization: 'token ' + token
    };
    const res = await axios.get('https://api.github.com/user/emails', {headers});
    if (res.status > 299) {
      throw new ForbiddenException('github email not received. status ' + res.status);
    }
    return res.data.find(e => e.primary)?.email;
  }

}
