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

  // ============================================
  // Champs existants pour le profil patient
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
  // NOUVEAUX CHAMPS POUR PROFIL MÉDECIN (Game changer)
  // ============================================
  
  // Présentation du médecin
  @Column({ nullable: true, type: 'text' })
  bio: string;

  // Photo de profil (URL)
  @Column({ nullable: true })
  photoUrl: string;

  // Diplômes (stockés en JSON array)
  @Column({ nullable: true, type: 'simple-array' })
  diplomas: string[];

  // Certifications (stockées en JSON array)
  @Column({ nullable: true, type: 'simple-array' })
  certifications: string[];

  // Langues parlées (stockées en JSON array)
  @Column({ nullable: true, type: 'simple-array' })
  languages: string[];

  // Tarif de consultation (FCFA)
  @Column({ nullable: true })
  consultationFee: number;

  // Années d'expérience
  @Column({ nullable: true })
  experienceYears: number;

  // Horaires de consultation (stockés en JSON array)
  @Column({ nullable: true, type: 'simple-array' })
  availability: string[];

  // Note moyenne (0-5)
  @Column({ nullable: true, type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating: number;

  // Nombre total d'avis
  @Column({ nullable: true, default: 0 })
  totalReviews: number;

  // Délai de réponse moyen
  @Column({ nullable: true })
  responseTime: string;

  // Numéro d'inscription à l'ordre des médecins
  @Column({ nullable: true })
  registrationNumber: string;

  // Adresse du cabinet
  @Column({ nullable: true })
  cabinetAddress: string;

  // Téléphone du cabinet
  @Column({ nullable: true })
  cabinetPhone: string;

  // Site web
  @Column({ nullable: true })
  website: string;

  // Réseaux sociaux (stockés en JSON)
  @Column({ nullable: true, type: 'simple-json' })
  socialMedia: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}