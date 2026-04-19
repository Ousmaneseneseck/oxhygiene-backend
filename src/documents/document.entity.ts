import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  patientId: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  filePath: string;

  @Column()
  fileType: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'autre' })
  documentType: string;

  @Column({ default: 'patient' })
  senderRole: string;

  @Column({ nullable: true })
  senderName: string;

  @CreateDateColumn()
  createdAt: Date;
}