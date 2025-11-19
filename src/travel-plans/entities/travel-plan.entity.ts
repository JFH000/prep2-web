import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity('travel_plans')
@Index(['alpha3Code'])
export class TravelPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 3 })
  alpha3Code: string;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'alpha3Code', referencedColumnName: 'alpha3Code' })
  country: Country;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
