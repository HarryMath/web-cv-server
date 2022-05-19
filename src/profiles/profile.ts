import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => Education, e => e.profile, {
    cascade: true,
    eager: false
  })
  education: Education[] = [];
}

export type IProfileDTO = Omit<Omit<Profile, 'password'>, 'sendNotifications'>;

export interface IUser {
  id: string;
  email: string;
  password: string;
}
