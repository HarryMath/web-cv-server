import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill, SkillUpdate } from './skill';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>
  ) {}

  async getOne(id: number): Promise<Skill> {
    const res = await this.repository.findOne({id});
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  async getByUserId(userId: number): Promise<Skill[]> {
    return await this.repository.find({profileId: userId});
  }

  async save(skill: Skill, userId: number): Promise<Skill> {
    skill.profileId = userId;
    return await this.repository.save(skill);
  }

  async update(skill: SkillUpdate, userId: number): Promise<SkillUpdate> {
    const id = skill.id;
    delete skill['id'];
    delete skill['profileId'];
    const oldVersion = await this.repository.findOne({id});
    if (!oldVersion) {
      throw new NotFoundException();
    }
    if (oldVersion.profileId != userId) {
      throw new ForbiddenException();
    }
    const updateResult = await this.repository.update({id}, skill);
    if (!updateResult.affected || updateResult.affected == 0) {
      // TODO handle this unreachable exception
      console.error('updated result affected: ' + updateResult.affected);
      throw new InternalServerErrorException('something wrong with updating skill');
    }
    skill.id = id;
    return skill;
  }

  async delete(id: number, userId: number): Promise<void> {
    const skill = await this.repository.findOne({id});
    if (!skill || skill.profileId != userId) {
      throw new ForbiddenException();
    }
    await this.repository.delete({id});
  }
}
