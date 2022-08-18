import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProfileDTO,
  Profile,
  ProfileRegister,
  MyProfileDTO,
  IProfileSave,
  ProfileUpdate,
  IUser,
  FeedBack
} from './profile';
import { Like, Repository } from 'typeorm';
import { CountryDefiner } from './country.definer';
import { Visitor } from './visitor';
import { MailerService } from '@nestjs-modules/mailer';
import { messages } from '../shared/messages';
import { utils } from '../shared/utils';
import { Education } from '../education/education';
import { Skill } from '../skills/skill';
import { Experience } from '../experiences/experience';
import { Project } from '../projects/project';

@Injectable()
export class ProfilesService {

  private readonly usersToVerify: Map<string, string> = new Map<string, string>();

  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    @InjectRepository(Visitor)
    private readonly visitorsRepository: Repository<Visitor>,
    private readonly countryDefiner: CountryDefiner,
    private readonly mailService: MailerService
  ) {}

  async getOwned(ownerId: number): Promise<MyProfileDTO> {
    // const profile = await this.profilesRepository.createQueryBuilder('p')
    //   .where('p.id = :id', { id: ownerId })
    //   .leftJoinAndMapMany('p.education', Education, 'edu', 'p.id=edu.profileId')
    //   .leftJoinAndMapMany('p.experience', Experience, 'ex', 'p.id=ex.profileId')
    //   .leftJoinAndMapMany('p.skills', Skill, 'sk', 'p.id=sk.profileId')
    //   .leftJoinAndMapMany('p.projects', Project, 'pr', 'p.id=pr.profileId')
    //   .leftJoinAndMapMany('p.images', Project, 'i', 'p.id=i.profileId')
    //   .getOne(); // @ts-ignore
    // profile.projects = profile.projects.map(p => p.toDto());
    const profile = await this.profilesRepository.findOne(ownerId);
    if (!profile) throw new NotFoundException();
    const dto = Object.assign({}, profile) as MyProfileDTO;
    delete dto['password'];
    return dto;
  }

  async getVisits(ownerId: number, offset = 0): Promise<Visitor[]> {
    return this.visitorsRepository.find({
      where: {profileId: ownerId},
      skip: offset
    });
  }

  async getOne(login: string, visitorIp: string, visitor?: IUser): Promise<ProfileDTO> {
    // const profile = await this.profilesRepository.createQueryBuilder('p')
    //   .where('p.login = :login', { login })
    //   .leftJoinAndMapMany('p.education', Education, 'edu', 'p.id=edu.profileId')
    //   .leftJoinAndMapMany('p.experience', Experience, 'ex', 'p.id=ex.profileId')
    //   .leftJoinAndMapMany('p.skills', Skill, 'sk', 'p.id=sk.profileId')
    //   .leftJoinAndMapMany('p.projects', Project, 'pr', 'p.id=pr.profileId')
    //   .getOne();
    const profile = await this.profilesRepository.findOne({login});
    if (!profile || !profile.isPublic || !profile.verified) throw new NotFoundException();
    const resolved = await Promise.all([
      this.educationRepository.find({profileId: profile.id}),
      this.experienceRepository.find({profileId: profile.id}),
      this.projectsRepository.find({profileId: profile.id}),
      this.skillsRepository.find({profileId: profile.id})
    ]);
    profile.education = resolved[0].sort((e1, e2) => {
      return e1.startYear + e1.startMonth / 12 - e2.startYear - e2.startMonth / 12;
    });
    profile.experience = resolved[1].sort((e1, e2) => {
      return e1.startYear + e1.startMonth / 12 - e2.startYear - e2.startMonth / 12;
    }); // @ts-ignore
    profile.projects = resolved[2].map(p => p.toDto());
    profile.skills = resolved[3];
    this.registerVisit(profile, visitorIp, visitor);
    const dto = Object.assign({}, profile) as ProfileDTO;
    delete dto['password'];
    delete dto['sendNotifications'];
    delete dto['lang'];
    return dto;
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
    };
    userToSave.lang = user.lang || 'EN';
    const response: MyProfileDTO = await this.profilesRepository.save(userToSave);
    delete response['password'];
    const token = await this.sendVerificationLink(userToSave);
    console.log('verification token: ' + token);
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
    console.warn('update: ', profile);
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
    try {
      const updateResult = await this.profilesRepository.update(
        {id: user.id},
        profile
      );
      if (!updateResult.affected || updateResult.affected === 0) {
        // TODO handle this unreachable exception
        console.error('updated result affected: ' + updateResult.affected);
        throw new InternalServerErrorException('something wrong with updating profile');
      }
      delete profile['password'];
      return profile;
    } catch (e) {
      console.warn('profile not updated: ', e);
      throw new InternalServerErrorException('profile not updated');
    }
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

  private async registerVisit(
    profile: Profile,
    visitorIp: string,
    visitor?: IUser
  ): Promise<void> {
    if (visitor && visitor.id === profile.id) {
      return; // visit yourself
    }
    const {country, city} = await this.countryDefiner.getCountry(visitorIp);
    const name = profile.fullName;
    this.visitorsRepository.save({
      profileId: profile.id,
      ip: visitorIp.length > 6 ? visitorIp : 'undefined',
      visitorLogin: visitor?.login,
      country,
      city,
      timestamp: new Date().getTime()
    });
    if (profile.sendNotifications) {
      try {
        const response = await this.mailService.sendMail({
          to: profile.email,
          subject: messages[profile.lang]['visit subject'],
          html: messages[profile.lang]['visit text'](name, country, city, visitorIp)
        });
        if (!response || !response.response?.includes('OK')) {
          // TODO log that message not send;
        }
      } catch (e) {
        // TODO warn that message not sent
      }
    }
  }

  async sendMessage(to: number, message: FeedBack): Promise<void> {
    const profile = await this.profilesRepository.findOne(to);
    if (!profile) {
      throw new NotFoundException();
    }
    try {
      const response = await this.mailService.sendMail({
        to: profile.email,
        subject: messages[profile.lang]['feedback subject'](message.name),
        html: messages[profile.lang]['feedback text'](profile.fullName, message.contact, message.text)
      });
      if (!response || !response.response?.includes('OK')) {
        console.warn('message not sent, response: ', response);
        throw new InternalServerErrorException('message not sent');
        // TODO log that message not send;
      }
    } catch (e) {
      console.warn('message not sent', e);
      throw new InternalServerErrorException();
    }
  }

  private async checkEmail(email: string): Promise<void> {
    const possibleMailConflicts = await this.profilesRepository.find({email});
    if ( possibleMailConflicts.length > 0 ) {
      throw new ConflictException('email is taken');
    }
  }
}
