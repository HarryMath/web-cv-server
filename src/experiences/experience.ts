import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

@Entity('experience')
export class Experience {

  @PrimaryGeneratedColumn()
  id!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @Column('int', {})
  startMonth!: number;

  @IsInt()
  @Column('int', {})
  startYear!: number;

  @IsInt()
  @Min(0) // 0 means thad date not selected
  @Max(12)
  @Column('int', {default: 0})
  endMonth!: number;

  @IsInt()
  @Column('int', {default: 0})
  endYear!: number;

  @MinLength(2)
  @Column('varchar', {length: 100})
  role!: string;

  @MinLength(2)
  @Column('varchar', {length: 100})
  place!: string;

  @Column('text', {nullable: true})
  companyLogo!: string|null;

  @IsString()
  @Column('text', {})
  description!: string;

  @IsString()
  @Column('varchar', {length: 50})
  location!: string;

  @IsOptional()
  @Column('varchar', {length: 50, nullable: true})
  link!: string|null;

  @IsOptional() // this field is set with value from authorised request
  @Column('int', {name: 'profileId'})
  profileId!: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'}
  ])
  profile: Profile | null = null;

}

export class ExperienceRefresh extends OmitType(Experience, ['profile', 'profileId']) {}

export class ExperienceUpdate extends PartialType(ExperienceRefresh) {}
