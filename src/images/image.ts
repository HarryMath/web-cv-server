import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';

@Entity('images')
export class Image {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @Column('text', {})
  publicUrl = '';

  @Column('varchar', {length: 100})
  key = '';

  @Column('int', {name: 'profileId'}) // @ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'}
  ])
  profile: Profile | null = null;
}
