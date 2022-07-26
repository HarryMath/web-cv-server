import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService],
  controllers: [ImagesController]
})
export class ImagesModule {}
