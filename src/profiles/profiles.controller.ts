import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDTO, Profile, MyProfileDTO, ProfileRegister, ProfileUpdate, IUser } from './profile';
import { RealIP } from 'nestjs-real-ip';
import { Public } from '../shared/decorators/public.decorator';
import { User } from '../shared/decorators/user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  @Public()
  getProfile(
    @Param('id') userId: string,
    @RealIP() visitorIp: string
  ): Promise<ProfileDTO> {
    return this.profilesService.getOne(userId, visitorIp);
  }

  @Post()
  @Public()
  registerProfile(@Body() user: ProfileRegister): Promise<MyProfileDTO> {
    console.log(user);
    return this.profilesService.registerProfile(user);
  }

  @Get(':token/verify')
  @Public()
  async verifyProfile(@Param('token') token: string): Promise<{ success: boolean }> {
    return {
      success: await this.profilesService.verifyProfile(token)
    };
  }

  @Patch()
  updateProfile(
    @Body() profile: ProfileUpdate,
    @User('email') user: IUser,
  ): Promise<ProfileUpdate> {
    return this.profilesService.updateProfile(profile, user);
  }

}
