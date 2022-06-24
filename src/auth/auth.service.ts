import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { utils } from '../shared/utils';
import { Repository } from 'typeorm';
import { IUser, Profile } from '../profiles/profile';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Profile)
    private readonly usersRepository: Repository<Profile>,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<{token: string}> {
    password = utils.md5(password);
    const users = await this.usersRepository.find({
      select: ['id', 'login', 'email'],
      where: {email, password}
    });
    if (users.length == 0) {
      throw new ForbiddenException();
    }
    const payload: IUser = users[0];
    return {
      token: this.jwtService.sign(payload)
    };
  }
}
