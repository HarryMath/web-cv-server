import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { Profile } from '../profiles/profile';
import { OmitType, PartialType } from '@nestjs/mapped-types';

@Entity('projects')
export class Project {

  @PrimaryGeneratedColumn() // @ts-ignore
  id: number;

  @MinLength(2)
  @Column('varchar', {length: 100})
  title = '';

  @MinLength(2)
  @Column('varchar', {length: 100})
  role = '';

  @IsOptional()
  @Column('varchar', {length: 100, nullable: true})
  place = '';

  @IsString()
  @Column('text', {}) // @ts-ignore
  description: string;

  @IsString()
  @IsOptional()
  @Column('text', {nullable: true})
  image: string | null = null;

  @IsString()
  @Column('text', {})
  links = '[]';

  @IsString()
  @Column('text', {})
  tags = '[]';

  @IsOptional() // this field is set with value from authorised request
  @Column('int', {name: 'profileId'}) // @ts-ignore
  profileId: number;

  @ManyToOne(() => Profile, {eager: false})
  @JoinColumn([
    {name: 'profileId', referencedColumnName: 'id'}
  ])
  profile: Profile | null = null;

  toDto(): ProjectDto {
    const p = new ProjectDto();
    p.id = this.id;
    p.title = this.title;
    p.role = this.role;
    p.place = this.place;
    p.description = this.description;
    p.image = this.image;
    try {
      p.links = JSON.parse(this.links);
    } catch (e) {
      p.links = [];
    }
    try {
      p.tags = JSON.parse(this.tags);
    } catch (e) {
      p.tags = [];
    }
    return p;
  }
}

export class ProjectLink {
  @IsString()
  label = '';

  @IsString()
  link = '';
}

export class ProjectDto {
  @IsOptional()
  id = 0;

  @MinLength(2)
  title = '';

  @MinLength(2)
  @Column('varchar', {length: 100})
  role = '';

  @IsOptional()
  @Column('varchar', {length: 100, nullable: true})
  place = '';

  @IsString()
  @Column('text', {}) // @ts-ignore
  description: string;

  @IsString()
  @IsOptional()
  @Column('text', {nullable: true})
  image: string | null = null;

  @IsArray()
  links: ProjectLink[] = [];

  @IsArray()
  tags: string[] = [];
}

export class ProjectRefresh extends OmitType(Project, ['profile', 'profileId', 'toDto']) {}

export class ProjectUpdate extends PartialType(ProjectRefresh) {
  toDto(): ProjectUpdateDto {
    const p = new ProjectUpdateDto();
    p.id = this.id;
    p.title = this.title;
    p.role = this.role;
    p.place = this.place;
    p.description = this.description;
    p.image = this.image;
    try {
      p.links = this.links ? JSON.parse(this.links): undefined;
    } catch (e) {
      p.links = [];
    }
    try {
      p.tags = this.tags ? JSON.parse(this.tags) : undefined;
    } catch (e) {
      p.tags = [];
    }
    return p;
  }
}

export class ProjectUpdateDto extends PartialType(ProjectDto) {}
