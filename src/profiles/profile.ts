import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../education/education';
import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Experience } from '../experiences/experience';
import { Skill } from '../skills/skill';
import { Project } from '../projects/project';
import { Image } from '../images/image';


@Entity('profiles')
export class Profile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {length: 50, unique: true})
  login!: string;

  @IsString()
  @Column('varchar', {length: 50})
  fullName!: string;

  @IsEmail()
  @Column('varchar', {length: 50, unique: true})
  email!: string;

  @IsOptional()
  @Column('varchar', {length: 40, nullable: true})
  role!: string|null;

  @IsString()
  @Column('text')
  password!: string;

  @IsBoolean()
  @Column('bool', {default: true})
  sendNotifications!: boolean;

  @IsOptional()
  @Column('text', {nullable: true})
  avatar!: string|null;

  @IsOptional()
  @Column('text', {nullable: true})
  intro!: string|null;

  @IsInt()
  @Column('int', {nullable: true})
  birthYear: number | null = null;

  @IsInt()
  @Column('int', {nullable: true})
  birthMonth!: number|null;

  @IsInt()
  @Column('int', {nullable: true})
  birthDay!: number|null;

  @IsOptional()
  @IsString()
  @Column('varchar', {length: 50, nullable: true})
  currentLocation!: string|null;

  @IsOptional()
  @IsBoolean()
  @Column('bool', {default: true})
  isPublic!:boolean;

  @Column('bool', {default: false})
  verified!: boolean;

  @IsOptional()
  @Column({type: 'enum', enum: ['EN', 'RU'], default: 'EN'})
  lang!: 'EN'|'RU';

  @IsOptional()
  @MinLength(10)
  @Column({type: 'text', nullable: true})
  github!: string|null;

  @IsOptional()
  @MinLength(10)
  @Column({type: 'text', nullable: true})
  linkedin!: string|null;

  @IsOptional()
  @MinLength(10)
  @Column({type: 'text', nullable: true})
  telegram!: string|null;

  education: Education[] = [];

  experience: Experience[] = [];

  skills: Skill[] = [];

  projects: Project[] = [];

  images: Image[] = [];
}

export class MyProfileDTO extends OmitType(Profile, ['password', 'projects', 'skills', 'images', 'experience', 'education']) {}

export class ProfileDTO extends OmitType(MyProfileDTO, ['sendNotifications', 'lang', 'isPublic']) {}

export class ProfileRegister extends PickType(Profile, [
  'email', 'fullName', 'password', 'lang'
]){}

export interface IProfileSave {
  email: string;
  login: string;
  fullName: string;
  password: string;
  verified: boolean;
  github?: string;
  linkedin?: string;
  lang: 'EN'|'RU';
}

class ProfileRefresh extends OmitType(Profile, ['verified', 'id', 'education', 'experience', 'skills', 'images', 'projects']) {}

export class ProfileUpdate extends PartialType(ProfileRefresh) {}

export interface IUser {
  id: number;
  login: string;
  email: string;
  // password: string;
}

export class FeedBack {
  @IsString()
  name!: number;

  @IsString()
  contact!: string;

  @IsOptional()
  @IsString()
  text!: string|undefined;
}
