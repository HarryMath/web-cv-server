import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn() // @ts-ignore
  id: number

  @Column('varchar', {length: 100}) // @ts-ignore
  institutionName: string;

  @Column('varchar', {length: 100})
  label: string | null = null;

  @Column('varchar', {length: 30}) // @ts-ignore
  startDate: string;

  @Column('varchar', {length: 30}) // @ts-ignore
  endDate: string

  @Column('int', {name: 'profileId'}) //@ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'},
  ])
  profile: Profile | null = null;
}
