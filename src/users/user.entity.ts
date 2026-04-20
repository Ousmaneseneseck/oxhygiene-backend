import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  bloodType: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ type: 'varchar', default: 'patient' })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  otpCode: string | null;

  @Column({ nullable: true, type: 'datetime' })
  otpExpires: Date | null;

  // Nouveaux champs pour le profil patient
  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ nullable: true })
  insuranceNumber: string;

  @Column({ nullable: true })
  socialSecurityNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}