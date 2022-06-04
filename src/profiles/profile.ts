import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../education/education';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';

@Entity('profiles')
export class Profile {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @Column('varchar', {length: 50, unique: true}) // @ts-ignore
  login: string;

  @IsString()
  @Column('varchar', {length: 50}) // @ts-ignore
  fullName: string;

  @IsEmail()
  @Column('varchar', {length: 50, unique: true}) // @ts-ignore
  email: string;

  @IsString()
  @Column('text') // @ts-ignore
  password: string;

  @IsBoolean()
  @Column('bool', {default: true})
  sendNotifications = true;

  @IsOptional()
  @Column('text', {nullable: true})
  avatar: string | null = null;

  @IsInt()
  @Column('int', {nullable: true})
  birthYear: number | null = null;

  @IsInt()
  @Column('int', {nullable: true})
  birthMonth: number | null = null;

  @IsInt()
  @Column('int', {nullable: true})
  birthDay: number | null = null;

  @IsOptional()
  @IsString()
  @Column('varchar', {length: 50, nullable: true})
  currentLocation: string | null = null;

  @Column('bool', {default: false})
  verified = false;

  @IsOptional()
  @Column({type: 'enum', enum: ['EN', 'RU'], default: 'EN'})
  lang: 'EN'|'RU' = 'EN';

  @OneToMany(() => Education, e => e.profile, {
    cascade: true,
    eager: false
  }) // @ts-ignore
  education: Education[];
}

export class MyProfileDTO extends OmitType(Profile, ['password']) {}

export class ProfileDTO extends OmitType(MyProfileDTO, ['sendNotifications', 'lang']) {}

export class ProfileRegister extends PickType(Profile, [
  'email', 'fullName', 'password', 'lang'
]){}

export interface IProfileSave {
  email: string;
  login: string;
  fullName: string;
  password: string;
  verified: boolean;
  lang: 'EN'|'RU';
}

class ProfileFullUpdate extends OmitType(Profile, ['verified', 'id']) {}

export class ProfileUpdate extends PartialType(ProfileFullUpdate) {}

export interface IUser {
  id: number;
  login: string;
  email: string;
  // password: string;
}
