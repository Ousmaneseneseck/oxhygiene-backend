import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // ============================================
  // CHAMPS OBLIGATOIRES
  // ============================================
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'varchar', default: 'patient' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ============================================
  // CHAMPS OPTIONNELS (communs)
  // ============================================
  
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  bloodType: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true, type: 'varchar' })
  otpCode: string | null;

  @Column({ nullable: true, type: 'datetime' })
  otpExpires: Date | null;

  // ============================================
  // CHAMPS POUR PROFIL PATIENT
  // ============================================
  
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

  // ============================================
  // CHAMPS POUR PROFIL MÉDECIN
  // ============================================
  
  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true, type: 'simple-array' })
  diplomas: string[];

  @Column({ nullable: true, type: 'simple-array' })
  certifications: string[];

  @Column({ nullable: true, type: 'simple-array' })
  languages: string[];

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 0 })
  consultationFee: number;

  @Column({ nullable: true })
  experienceYears: number;

  @Column({ nullable: true, type: 'simple-array' })
  availability: string[];

  @Column({ nullable: true, type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @Column({ nullable: true, default: 0 })
  totalReviews: number;

  @Column({ nullable: true })
  responseTime: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  cabinetAddress: string;

  @Column({ nullable: true })
  cabinetPhone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true, type: 'simple-json' })
  socialMedia: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}