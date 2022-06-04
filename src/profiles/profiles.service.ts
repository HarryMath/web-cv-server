import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDTO, Profile, ProfileRegister, MyProfileDTO, IProfileSave, ProfileUpdate, IUser } from './profile';
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

  async registerProfile(user: ProfileRegister): Promise<MyProfileDTO> {
    await this.checkEmail(user.email);
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

  async updateProfile(profile: ProfileUpdate, user: IUser): Promise<ProfileUpdate> {
    if (profile.email && profile.email != user.email) {
      await this.checkEmail(profile.email);
    }
    if (profile.password) {
      profile.password = utils.md5(profile.password);
    }
    if (profile.fullName) {
      profile.fullName = profile.fullName.trim();
      let login = profile.fullName.replace(' ', '');
      const possibleLoginConflicts = (await this.profilesRepository.find({
        login: Like(login + '%')
      })).length;
      if (possibleLoginConflicts > 0) {
        login = login + possibleLoginConflicts;
      }
      profile.login = login;
    }
    const updateResult = await this.profilesRepository.update(
      {id: user.id},
      profile
    );
    console.log(updateResult);
    if (!updateResult.affected || updateResult.affected === 0) {
      // TODO handle this unreachable exception
      console.error('updated result affected: ' + updateResult.affected);
      throw new InternalServerErrorException('something wrong')
    }
    delete profile['password'];
    return profile;
  }

  async sendVerificationLink(user: IProfileSave): Promise<string> {
    const token = utils.md5(this.usersToVerify.size + user.login + Math.random());
    await this.mailService.sendMail({
      to: user.email,
      subject: messages[user.lang]['verification subject'],
      html: messages[user.lang]['verification text'](user.fullName, token)
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
        html: messages[profile.lang]['visit text'](name, country, city, visitorIp)
      });
    }
  }

  private async checkEmail(email: string): Promise<void> {
    const possibleMailConflicts = await this.profilesRepository.find({email});
    if ( possibleMailConflicts.length > 0 ) {
      throw new ConflictException('email is taken');
    }
  }
}
