import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from '../profiles/profile';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @MinLength(2)
  @Column('varchar', {length: 100})
  institutionName!: string;

  @IsString()
  @Column('varchar', {length: 100, default: ''})
  label!: string;

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
  endMonth!: number;

  @IsInt()
  @Column('int', {default: 0})
  endYear!: number;

  @Column('int', {name: 'profileId'}) //@ts-ignore
  profileId: number;

  @IsOptional()
  @Column('text', {nullable: true})
  description!: string|null;

  @ManyToOne(() => Profile, (profile) => profile.education,{eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'},
  ])
  profile: Profile | null = null;
}

export class EducationRefresh extends OmitType(Education, ['profile', 'profileId']) {}

export class EducationUpdate extends PartialType(EducationRefresh) {}
