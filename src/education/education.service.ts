import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education, EducationUpdate } from './education';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly repository: Repository<Education>
  ) {}

  async getOne(id: number): Promise<Education> {
    const res = await this.repository.findOne({id});
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  async getByUserId(userId: number): Promise<Education[]> {
    return await this.repository.find({profileId: userId});
  }

  async save(edu: Education, userId: number): Promise<Education> {
    edu.profileId = userId;
    return await this.repository.save(edu);
  }

  async update(edu: EducationUpdate, userId: number): Promise<EducationUpdate> {
    const id = edu.id;
    delete edu['id'];
    delete edu['profile'];
    const oldVersion = await this.repository.findOne({id});
    if (!oldVersion) {
      throw new NotFoundException();
    }
    if (oldVersion.profileId != userId) {
      throw new ForbiddenException();
    }
    edu['profileId'] = userId;
    const updateResult = await this.repository.update({id}, edu);
    if (!updateResult.affected || updateResult.affected == 0) {
      // TODO handle this unreachable exception
      console.error('updated result affected: ' + updateResult.affected);
      throw new InternalServerErrorException('something wrong with updating education');
    }
    edu.id = id;
    return edu;
  }

  async delete(id: number, userId: number): Promise<void> {
    const exp = await this.repository.findOne({id});
    if (!exp || exp.profileId != userId) {
      throw new ForbiddenException();
    }
    await this.repository.delete({id});
  }
}
