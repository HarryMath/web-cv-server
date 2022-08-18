import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Experience, ExperienceUpdate } from './experience';
import { User } from '../shared/decorators/user.decorator';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
export class ExperiencesController {

  constructor(private service: ExperiencesService) {
  }

  @Get()
  get(@User('id') userId: number): Promise<Experience[]> {
    return this.service.getByUserId(userId);
  }

  @Patch()
  update(
    @Body() e: ExperienceUpdate,
    @User('id') userId: number
  ): Promise<ExperienceUpdate> {
    return this.service.update(e, userId);
  }

  @Post()
  save(
    @Body() e: Experience,
    @User('id') userId: number
  ): Promise<Experience> {
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
