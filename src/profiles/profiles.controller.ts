import { Body, Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDTO, IUser, Profile, MyProfileDTO, IProfileRegister } from './profile';
import { RealIP } from 'nestjs-real-ip';
import { DeepPartial } from 'typeorm';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  async getProfile(
    @Param('id') userId: string,
    @RealIP() visitorIp: string
  ): Promise<ProfileDTO> {
    return await this.profilesService.getOne(userId, visitorIp);
  }

  registerProfile(@Body() user: IProfileRegister): MyProfileDTO {
    return await this.profilesService.registerProfile(user);
  }

  updateProfile(@Body() profile: DeepPartial<Profile>): MyProfileDTO {

  }

}
