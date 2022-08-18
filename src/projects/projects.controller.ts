import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { User } from '../shared/decorators/user.decorator';
import { ProjectDto, ProjectUpdateDto } from './project';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly service: ProjectsService
  ) {}

  @Get()
  get(@User('id') userId: number): Promise<ProjectDto[]> {
    return this.service.getByUserId(userId);
  }

  @Patch()
  update(
    @Body() e: ProjectUpdateDto,
    @User('id') userId: number
  ): Promise<ProjectUpdateDto> {
    return this.service.update(e, userId);
  }

  @Post()
  save(
    @Body() e: ProjectDto,
    @User('id') userId: number
  ): Promise<ProjectDto> {
    return this.service.save(e, userId);
  }

  @Delete()
  delete(
    @Query('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ): Promise<void> {
    return this.service.delete(id, userId);
  }

}
