import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './experience';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { ImageParser } from './image.parser';

@Module({
  imports: [TypeOrmModule.forFeature([Experience])],
  providers: [ExperiencesService, ImageParser],
  controllers: [ExperiencesController]
})
export class ExperiencesModule {}
