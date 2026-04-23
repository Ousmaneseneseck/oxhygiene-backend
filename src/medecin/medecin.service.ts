import { Injectable } from '@nestjs/common';

export interface MedecinProfile {
  id: string;
  phone?: string;
  fullname: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  languages: string;
  bio?: string;
  photoUrl?: string;
  cabinetAddress?: string;
  cabinetPhone?: string;
  registrationNumber?: string;
  website?: string;
  availability?: string[];
  createdAt: Date;
}

@Injectable()
export class MedecinService {
  private medecins: MedecinProfile[] = [];

  async createProfile(userId: string, dto: any, phone?: string): Promise<MedecinProfile> {
    const profile: MedecinProfile = {
      id: userId,
      phone,
      fullname: dto.fullname,
      specialty: dto.specialty,
      experience: dto.experience,
      consultationFee: dto.consultationFee,
      languages: dto.languages,
      bio: dto.bio,
      photoUrl: dto.photoUrl,
      cabinetAddress: dto.cabinetAddress,
      cabinetPhone: dto.cabinetPhone,
      registrationNumber: dto.registrationNumber,
      website: dto.website,
      availability: dto.availability,
      createdAt: new Date(),
    };
    this.medecins.push(profile);
    return profile;
  }

  async getProfile(userId: string): Promise<MedecinProfile | undefined> {
    return this.medecins.find(m => m.id === userId || m.phone === userId);
  }

  async getAllMedecins(): Promise<MedecinProfile[]> {
    return this.medecins;
  }
}