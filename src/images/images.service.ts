import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {

  private readonly storage: S3;
  private readonly s3Endpoint: string;
  private readonly bucketName: string;
  private readonly publicPrefix: string;

  constructor(
    @InjectRepository(Image)
    private readonly repository: Repository<Image>
  ) {
    this.bucketName = process.env.S3_BUCKET || '';
    this.publicPrefix = process.env.S3_PUBLIC_PREFIX || '';
    this.s3Endpoint = process.env.S3_ENDPOINT || '';
    this.storage = new S3({
      apiVersion: 'latest',
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.S3_ENDPOINT,
      s3ForcePathStyle: true,
      signatureVersion: 'v2'
      // s3BucketEndpoint: true,
      // hostPrefixEnabled: false
    });
  }

  async saveImage(img: Express.Multer.File, userId: number): Promise<Image> {
    try {
      const key = this.getUniqueImageName(img, userId);
      const uploadedImage = await this.storage.upload({
        Bucket: this.bucketName,
        Key: this.getUniqueImageName(img, userId),
        Body: img.buffer
      }).promise();
      console.log(uploadedImage);
      const imageEntity = new Image();
      imageEntity.key = key;
      imageEntity.profileId = userId;
      imageEntity.publicUrl = this.getPublicUrl(key);
      return await this.repository.save(imageEntity);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e, 'unable to save image to S3');
    }
  }

  async deleteImage(id: number, userId: number): Promise<void> {
    const img = await this.repository.findOne({id});
    if (!img) {
      throw new NotFoundException();
    }
    if (img.profileId != userId) {
      throw new ForbiddenException();
    }
    const deleteResponse = await this.storage.deleteObject({
      Bucket: this.bucketName,
      Key: img.key
    }).promise();
    console.log(deleteResponse);
    await this.repository.delete({id});
  }

  getByUserId(userId: number): Promise<Image[]> {
    return this.repository.find({profileId: userId});
  }

  private getUniqueImageName(img: Express.Multer.File, userId: number): string {
    return `${userId}${new Date().getTime() % 1000000}.${img.originalname.split('.')[1]}`;
  }

  private getPublicUrl(key: string): string {
    return `${this.s3Endpoint}v1/${this.publicPrefix}/${this.bucketName}/${key}`;
  }
}
