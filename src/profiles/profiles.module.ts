import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile';
import { CountryDefiner } from './country.definer';
import { Visitor } from './visitor';
import { Experience } from '../experiences/experience';
import { Education } from '../education/education';
import { Project } from '../projects/project';
import { Skill } from '../skills/skill';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Experience, Education, Project, Skill, Visitor])],
  controllers: [ProfilesController],
  providers: [CountryDefiner, ProfilesService]
})
export class ProfilesModule {}
