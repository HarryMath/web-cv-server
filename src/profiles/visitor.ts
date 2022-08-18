import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('visitors')
export class Visitor {

  @Column('int', {}) // @ts-ignore
  profileId: number;

  @Column('varchar', {length: 30}) // @ts-ignore
  ip: string;

  @Column('varchar', {length: 50, default: null, nullable: true})
  visitorLogin: string|undefined;

  @Column('varchar', {length: 50, default: null, nullable: true})
  country!: string|null;

  @Column('varchar', {length: 50, default: null, nullable: true})
  city!: string|null;

  @PrimaryColumn('bigint', {}) // @ts-ignore
  timestamp: number;
}
