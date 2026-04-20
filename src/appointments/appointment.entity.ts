import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  doctorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: 'en attente' })
  status: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, type: 'text' })
  prescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}