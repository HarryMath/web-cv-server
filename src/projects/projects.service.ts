import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectDto, ProjectUpdate, ProjectUpdateDto } from './project';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  async getOne(id: number): Promise<ProjectDto> {
    const res = await this.repository.findOne({id});
    if (!res) {
      throw new NotFoundException();
    }
    return res.toDto();
  }

  async getByUserId(userId: number): Promise<ProjectDto[]> {
    return (await this.repository.find({profileId: userId})).map(p => p.toDto());
  }

  async save(p: ProjectDto, userId: number): Promise<ProjectDto> {
    const entity = this.toEntity(p, userId);
    entity.profileId = userId;
    return (await this.repository.save(entity)).toDto();
  }

  async update(dto: ProjectUpdateDto, userId: number): Promise<ProjectUpdateDto> {
    const project = this.toEntityUpdate(dto);
    const id = project.id;
    delete project['id'];
    const oldVersion = await this.repository.findOne({id});
    if (!oldVersion) {
      throw new NotFoundException();
    }
    if (oldVersion.profileId != userId) {
      throw new ForbiddenException();
    }
    project['profileId'] = userId;
    const updateResult = await this.repository.update({id}, project);
    if (!updateResult.affected || updateResult.affected == 0) {
      // TODO handle this unreachable exception
      console.error('updated result affected: ' + updateResult.affected);
      throw new InternalServerErrorException('something wrong with updating experience');
    }
    project.id = id;
    return project.toDto();
  }

  private toEntityUpdate(dto: ProjectUpdateDto): ProjectUpdate|Project {
    const p = new ProjectUpdate();
    p.id = dto.id;
    p.title = dto.title;
    p.role = dto.role;
    p.place = dto.place;
    p.description = dto.description;
    p.image = dto.image;
    if (dto.links)
      p.links = JSON.stringify(dto.links);
    if (dto.tags)
      p.tags = JSON.stringify(dto.tags);
    return p;
  }

  private toEntity(dto: ProjectDto, ownerId: number): Project {
    const p = new Project();
    p.id = dto.id;
    p.title = dto.title;
    p.role = dto.role;
    p.place = dto.place;
    p.description = dto.description;
    p.image = dto.image;
    if (dto.links)
      p.links = JSON.stringify(dto.links);
    if (dto.tags)
      p.tags = JSON.stringify(dto.tags);
    p.profileId = ownerId;
    return p;
  }

  async delete(id: number, userId: number): Promise<void> {
    const exp = await this.repository.findOne({id});
    if (!exp || exp.profileId != userId) {
      throw new ForbiddenException();
    }
    await this.repository.delete({id});
  }
}
