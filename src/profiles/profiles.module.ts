import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile';
import { CountryDefiner } from './country.definer';
import { Visitor } from './visitor';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Visitor])],
  controllers: [ProfilesController],
  providers: [CountryDefiner, ProfilesService]
})
export class ProfilesModule {}
