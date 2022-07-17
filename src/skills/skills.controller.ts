import { Body, Controller, Delete, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { User } from '../shared/decorators/user.decorator';
import { Skill, SkillUpdate } from './skill';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Patch()
  update(
    @Body() e: SkillUpdate,
    @User('id') userId: number
  ): Promise<SkillUpdate> {
    return this.service.update(e, userId);
  }

  @Post()
  save(
    @Body() e: Skill,
    @User('id') userId: number
  ): Promise<Skill> {
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
