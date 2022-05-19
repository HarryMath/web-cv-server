import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { IProfileDTO } from './profile';

@Controller('users')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  getProfile(@Param('id') userId: string): IProfileDTO {
    return this.profilesService.getUserDetails(userId);
  }

}
