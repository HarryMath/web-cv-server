import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';

@Entity('experiences')
export class Experience {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @Column('varchar', {length: 20}) // @ts-ignore
  start: string;

  @Column('varchar', {length: 20}) // @ts-ignore
  end: string;

  @Column('varchar', {length: 100}) // @ts-ignore
  role: string;

  @Column('varchar', {length: 100}) // @ts-ignore
  place: string;

  @Column('text', {}) // @ts-ignore
  description: string;

  @Column('varchar', {length: 50})
  location: string | null = null;

  @Column('varchar', {length: 50})
  link: string | null = null;

  @Column('int', {name: 'profileId'}) // @ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'}
  ])
  profile: Profile | null = null;

}
