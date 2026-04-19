import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('health_measures')
export class HealthMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  systolic: string;

  @Column({ nullable: true })
  diastolic: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @CreateDateColumn({ nullable: true })
  measuredAt: Date;
}