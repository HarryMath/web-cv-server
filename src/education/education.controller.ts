import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { User } from '../shared/decorators/user.decorator';
import { EducationService } from './education.service';
import { Education, EducationUpdate } from './education';

@Controller('educations')
export class EducationController {
  constructor(private service: EducationService) {
  }

  @Get()
  get(@User('id') userId: number): Promise<Education[]> {
    return this.service.getByUserId(userId);
  }

  @Patch()
  update(
    @Body() e: EducationUpdate,
    @User('id') userId: number
  ): Promise<EducationUpdate> {
    return this.service.update(e, userId);
  }

  @Post()
  save(
    @Body() e: Education,
    @User('id') userId: number
  ): Promise<Education> {
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
