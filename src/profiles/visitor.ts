import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('visitors')

export class Visitor {

  @Column('int', {}) // @ts-ignore
  profileId: number;

  @Column('varchar', {length: 30}) // @ts-ignore
  ip: string;

  @Column('varchar', {length: 50}) // @ts-ignore
  country: string;

  @PrimaryColumn('bigint', {}) // @ts-ignore
  timestamp: number;
}
