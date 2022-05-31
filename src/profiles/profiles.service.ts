import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDTO, Profile, IProfileRegister, MyProfileDTO, IProfileSave } from './profile';
import { Like, Repository } from 'typeorm';
import { CountryDefiner } from './country.definer';
import { Visitor } from './visitor';
import { MailerService } from '@nestjs-modules/mailer';
import { messages } from '../shared/messages';
import { utils } from '../shared/utils';

@Injectable()
export class ProfilesService {

  private readonly usersToVerify: Map<string, string> = new Map<string, string>();

  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(Visitor)
    private readonly visitorsRepository: Repository<Visitor>,
    private readonly countryDefiner: CountryDefiner,
    private readonly mailService: MailerService
  ) {}

  async getOne(login: string, visitorIp: string): Promise<ProfileDTO> {
    const profile = await this.profilesRepository.findOne({login});
    if (!profile) throw new NotFoundException();
    this.registerVisit(profile, visitorIp);
    const dto = profile as ProfileDTO;
    delete dto['password'];
    delete dto['sendNotifications'];
    delete dto['lang'];
    return profile;
  }

  async registerProfile(user: IProfileRegister): Promise<MyProfileDTO> {
    const possibleMailConflicts = await this.profilesRepository.find({email: user.email});
    if ( possibleMailConflicts.length > 0 ) {
      throw new ConflictException('email is taken');
    }
    user.fullName = user.fullName.trim();
    user.password = utils.md5(user.password);
    let login = user.fullName.replace(' ', '');
    const possibleLoginConflicts = (await this.profilesRepository.find({
      login: Like(login + '%')
    })).length;
    if (possibleLoginConflicts > 0) {
      login = login + possibleLoginConflicts;
    }
    const userToSave: IProfileSave = {
      login,
      verified: false,
      ...user
    }
    userToSave.lang = user.lang || 'EN';
    const response: MyProfileDTO = await this.profilesRepository.save(userToSave);
    delete response['password'];
    const token = await this.sendVerificationLink(userToSave);
    this.usersToVerify.set(token, response.login);
    return response;
  }

  async verifyProfile(token: string): Promise<boolean> {
    if (this.usersToVerify.has(token)) {
      await this.profilesRepository.update({
          login: this.usersToVerify.get(token)
        },
        {
          verified: true
        });
      return true;
    }
    throw new NotFoundException('invalid token');
  }

  async sendVerificationLink(user: IProfileSave): Promise<string> {
    const token = utils.md5(this.usersToVerify.size + user.login + Math.random());
    await this.mailService.sendMail({
      to: user.email,
      subject: messages[user.lang]['verification subject'],
      text: messages[user.lang]['verification text'](user.fullName, token)
    });
    return token;
  }

  private async registerVisit(profile: Profile, visitorIp: string): Promise<void> {
    const {country, city} = await this.countryDefiner.getCountry(visitorIp);
    const name = profile.fullName;
    this.visitorsRepository.save({
      profileId: profile.id,
      ip: visitorIp,
      country: `${country}`,
      timestamp: new Date().getTime()
    });
    if (profile.sendNotifications) {
      this.mailService.sendMail({
        to: profile.email,
        subject: messages[profile.lang]['visit subject'],
        text: messages[profile.lang]['visit text'](name, country, city, visitorIp)
      });
    }
  }
}
