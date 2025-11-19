import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('countries')
@Index(['alpha3Code'], { unique: true })
export class Country {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  alpha3Code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subregion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string;

  @Column({ type: 'bigint' })
  population: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  flagUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
