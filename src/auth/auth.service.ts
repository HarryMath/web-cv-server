import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { utils } from '../shared/utils';
import { Like, Repository } from 'typeorm';
import { IProfileSave, MyProfileDTO, Profile } from '../profiles/profile';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubService } from './github.service';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Profile)
    private readonly usersRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly github: GithubService
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
    const payload = {
      id: users[0].id,
      login: users[0].login,
      email: users[0].email,
    };
    return {
      token: this.jwtService.sign(payload)
    };
  }

  async authWithGitHub(code: string): Promise<{token: string}>  {
    const token = await this.github.getToken(code);
    const email = await this.github.getEmail(token);
    const userData = await this.github.getUserData(token);

    const users = await this.usersRepository.find({
      select: ['id', 'login', 'email'],
      where: {email}
    });
    if (users.length > 0) { // already registered
      const payload = {
        id: users[0].id,
        login: users[0].login,
        email: users[0].email,
      };
      return {
        token: this.jwtService.sign(payload)
      };
    }
    // else not registered
    const userToSave: IProfileSave = {
      email,
      fullName: userData.name.trim(),
      lang: 'EN',
      login: userData.login,
      password: this.randomString(),
      verified: true
    };
    const possibleLoginConflicts = (await this.usersRepository.find({
      login: Like(userToSave.login + '%')
    })).length;
    if (possibleLoginConflicts > 0) {
      userToSave.login += possibleLoginConflicts;
    }
    const savedUser: MyProfileDTO = await this.usersRepository.save(userToSave);
    return {
      token: this.jwtService.sign({
        id: savedUser.id,
        login: savedUser.login,
        email: savedUser.email
      })
    };
  }

  private randomString(): string {
    return '' + Math.random() + new Date().getDate() % 100;
  }
}
