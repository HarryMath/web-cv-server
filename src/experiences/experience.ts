import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

@Entity('experience')
export class Experience {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @Column('int', {}) // @ts-ignore
  startMonth: number;

  @IsInt()
  @Column('int', {}) // @ts-ignore
  startYear: number;

  @IsInt()
  @Min(0) // 0 means thad date not selected
  @Max(12)
  @Column('int', {default: 0})
  endMonth = 0;

  @IsInt()
  @Column('int', {default: 0})
  endYear = 0;

  @MinLength(2)
  @Column('varchar', {length: 100}) // @ts-ignore
  role: string;

  @MinLength(2)
  @Column('varchar', {length: 100}) // @ts-ignore
  place: string;

  @IsString()
  @Column('text', {}) // @ts-ignore
  description: string;

  @IsString()
  @Column('varchar', {length: 50})
  location = '';

  @IsOptional()
  @Column('varchar', {length: 50, nullable: true})
  link: string | null = null;

  @IsOptional() // this field is set with value from authorised request
  @Column('int', {name: 'profileId'}) // @ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'}
  ])
  profile: Profile | null = null;

}

export class ExperienceRefresh extends OmitType(Experience, ['profile', 'profileId']) {}

export class ExperienceUpdate extends PartialType(ExperienceRefresh) {}
