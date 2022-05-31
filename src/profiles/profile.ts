import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from '../education/education';

@Entity('profiles')
export class Profile {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @Column('varchar', {length: 50, unique: true}) // @ts-ignore
  login: string;

  @Column('varchar', {length: 50}) // @ts-ignore
  fullName: string;

  @Column('varchar', {length: 50, unique: true}) // @ts-ignore
  email: string;

  @Column('text') // @ts-ignore
  password: string;

  @Column('bool', {default: true})
  sendNotifications = true;

  @Column('text', {nullable: true})
  avatar: string | null = null;

  @Column('int', {nullable: true})
  birthYear: number | null = null;

  @Column('int', {nullable: true})
  birthMonth: number | null = null;

  @Column('int', {nullable: true})
  birthDay: number | null = null;

  @Column('varchar', {length: 50, nullable: true})
  currentLocation: string | null = null;

  @Column('bool', {default: false})
  verified = false;

  @Column({type: 'enum', enum: ['EN', 'RU'], default: 'EN'})
  lang: 'EN'|'RU' = 'EN';

  @OneToMany(() => Education, e => e.profile, {
    cascade: true,
    eager: false
  })
  education: Education[] = [];
}

export type MyProfileDTO = Omit<Profile, 'password'>;

export type ProfileDTO = Omit<Omit<
  MyProfileDTO,
  'sendNotifications'>,
  'lang'>;

export interface IProfileRegister {
  email: string;
  fullName: string;
  password: string;
  lang: 'EN'|'RU';
}

export interface IProfileSave {
  email: string;
  login: string;
  fullName: string;
  password: string;
  verified: boolean;
  lang: 'EN'|'RU';
}

export interface IUser {
  id: string;
  email: string;
  password: string;
}
