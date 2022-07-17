import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';
import { IsInt, Max, Min, MinLength } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

@Entity('skills')
export class Skill {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @MinLength(2)
  @Column('varchar', {length: 35})
  skillGroup: 'Programming languages'|'Web technologies'|'Databases'
    |'Infrastructure'|'Operating systems'|'Foreign languages'|string = 'Other';

  @MinLength(2)
  @Column('varchar', {length: 25}) // @ts-ignore
  skillName: string;

  @IsInt()
  @Min(1)
  @Max(5)
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

export class SkillRefresh extends OmitType(Skill, ['profileId', 'profile']) {}

export class SkillUpdate extends PartialType(SkillRefresh) {}
