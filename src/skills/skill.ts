import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';

@Entity('skills')
export class Skill {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @Column('varchar', {length: 20})
  skillGroup: 'Programming languages'|'Web technologies'|'Databases'
    |'Infrastructure'|'Operating systems'|'Foreign languages'|string = 'Other';

  @Column('varchar', {length: 20}) // @ts-ignore
  skillName: string;

  @Column('int', {}) // @ts-ignore
  skillLevel: number;

  @Column('int', {name: 'profileId'}) //@ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'},
  ])
  profile: Profile | null = null;
}
