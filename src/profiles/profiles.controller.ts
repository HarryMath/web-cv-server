import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDTO, MyProfileDTO, ProfileRegister, ProfileUpdate, IUser, FeedBack } from './profile';
import { RealIP } from 'nestjs-real-ip';
import { Public } from '../shared/decorators/public.decorator';
import { User } from '../shared/decorators/user.decorator';
import { Free } from '../shared/decorators/free.decorator';
import { Visitor } from './visitor';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me/view')
  getMyProfile(@User('id') userId: number): Promise<ProfileDTO> {
    return this.profilesService.getOwned(userId);
  }

  @Get('me/visits')
  getVisits(@User('id') userId: number): Promise<Visitor[]> {
    return this.profilesService.getVisits(userId);
  }

  @Free()
  @Get(':id')
  getProfile(
    @Param('id') userId: string,
    @RealIP() visitorIp: string,
    @User() visitor: IUser|undefined
  ): Promise<ProfileDTO> {
    return this.profilesService.getOne(userId, visitorIp, visitor);
  }

  @Public()
  @Post(':id/feedback')
  sendFeedBack(
    @Param('id', ParseIntPipe) userId: number,
    @Body() message: FeedBack
  ): Promise<void> {
    return this.profilesService.sendMessage(userId, message);
  }

  @Post()
  @Public()
  registerProfile(@Body() user: ProfileRegister): Promise<MyProfileDTO> {
    return this.profilesService.registerProfile(user);
  }

  @Public()
  @Get(':token/verify')
  async verifyProfile(@Param('token') token: string): Promise<{ success: boolean }> {
    return {
      success: await this.profilesService.verifyProfile(token)
    };
  }

  @Patch()
  updateProfile(
    @Body() profile: ProfileUpdate,
    @User() user: IUser,
  ): Promise<ProfileUpdate> {
    return this.profilesService.updateProfile(profile, user);
  }

}
