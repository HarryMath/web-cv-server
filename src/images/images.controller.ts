import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../shared/decorators/user.decorator';
import { Image } from './image';

@Controller('images')
export class ImagesController {

  constructor(private readonly service: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId: number
  ): Promise<Image> {
    return this.service.saveImage(file, userId);
  }

  @Get()
  getByUserId(@User('id') userId: number): Promise<Image[]> {
    return this.service.getByUserId(userId);
  }

  @Delete()
  deleteImage(
    @Query('id') imageId: number,
    @User('id') userId: number
  ): Promise<void> {
    return this.service.deleteImage(imageId, userId);
  }
}
