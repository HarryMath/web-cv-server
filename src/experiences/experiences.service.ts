import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience, ExperienceUpdate } from './experience';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly repository: Repository<Experience>
  ) {}

  async getOne(id: number): Promise<Experience> {
    const res = await this.repository.findOne({id});
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  async getByUserId(userId: number): Promise<Experience[]> {
    return await this.repository.find({profileId: userId});
  }

  async save(exp: Experience, userId: number): Promise<Experience> {
    exp.profileId = userId;
    return await this.repository.save(exp);
  }

  async update(exp: ExperienceUpdate, userId: number): Promise<ExperienceUpdate> {
    const id = exp.id;
    delete exp['id'];
    const oldVersion = await this.repository.findOne({id});
    if (!oldVersion) {
      throw new NotFoundException();
    }
    if (oldVersion.profileId != userId) {
      throw new ForbiddenException();
    }
    const updateResult = await this.repository.update({id}, exp);
    if (!updateResult.affected || updateResult.affected == 0) {
      // TODO handle this unreachable exception
      console.error('updated result affected: ' + updateResult.affected);
      throw new InternalServerErrorException('something wrong with updating experience');
    }
    exp.id = id;
    return exp;
  }

  async delete(id: number, userId: number): Promise<void> {
    const exp = await this.repository.findOne({id});
    if (!exp || exp.profileId != userId) {
      throw new ForbiddenException();
    }
    await this.repository.delete({id});
  }
}
