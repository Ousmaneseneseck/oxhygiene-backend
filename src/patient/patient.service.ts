import { Injectable } from '@nestjs/common';

export interface PatientProfile {
  id: string;
  phone: string;
  fullname: string;
  email: string;
  birthdate?: string;
  birthplace?: string;
  gender?: string;
  profession?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  emergencyPhone?: string;
  emergencyName?: string;
  mutuelle?: string;
  mutuelleNumber?: string;
  socialSecurity?: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  surgeries?: string;
  familyHistory?: string;
  treatments?: string;
  doctorName?: string;
  doctorPhone?: string;
  doctorAddress?: string;
  vitalCard?: string;
  organDonor?: string;
  observations?: string;
  createdAt: Date;
}

@Injectable()
export class PatientService {
  private patients: PatientProfile[] = [];

  async createProfile(userId: string, dto: any): Promise<PatientProfile> {
    const existing = await this.getProfile(userId);
    if (existing) {
      Object.assign(existing, dto);
      return existing;
    }
    
    const profile: PatientProfile = {
      id: userId,
      phone: userId,
      fullname: dto.fullname || '',
      email: dto.email || '',
      birthdate: dto.birthdate,
      birthplace: dto.birthplace,
      gender: dto.gender,
      profession: dto.profession,
      address: dto.address,
      city: dto.city,
      postalCode: dto.postalCode,
      emergencyPhone: dto.emergencyPhone,
      emergencyName: dto.emergencyName,
      mutuelle: dto.mutuelle,
      mutuelleNumber: dto.mutuelleNumber,
      socialSecurity: dto.socialSecurity,
      bloodType: dto.bloodType,
      allergies: dto.allergies,
      chronicDiseases: dto.chronicDiseases,
      surgeries: dto.surgeries,
      familyHistory: dto.familyHistory,
      treatments: dto.treatments,
      doctorName: dto.doctorName,
      doctorPhone: dto.doctorPhone,
      doctorAddress: dto.doctorAddress,
      vitalCard: dto.vitalCard,
      organDonor: dto.organDonor,
      observations: dto.observations,
      createdAt: new Date(),
    };
    this.patients.push(profile);
    return profile;
  }

  async getProfile(phone: string): Promise<PatientProfile | undefined> {
    return this.patients.find(p => p.phone === phone || p.id === phone);
  }

  async getAppointments(phone: string): Promise<any[]> {
    // Données mockées pour les tests
    return [
      { medecinName: 'Dr Ousmane Fall', date: '25/04/2026', time: '10:00', motif: 'Consultation générale', status: 'pending' },
      { medecinName: 'Dr Sophie Martin', date: '28/04/2026', time: '14:30', motif: 'Suivi cardiologique', status: 'confirmed' }
    ];
  }

  async getConsultations(phone: string): Promise<any[]> {
    return [
      { doctorName: 'Dr Sophie Martin', specialty: 'Cardiologie', date: '15/03/2026', diagnosis: 'Hypertension légère', prescription: 'Traitement en cours' },
      { doctorName: 'Dr Amadou Diop', specialty: 'Pédiatrie', date: '10/02/2026', diagnosis: 'Consultation générale', prescription: 'Repos' },
      { doctorName: 'Dr Ousmane Fall', specialty: 'Médecine Générale', date: '20/01/2026', diagnosis: 'Bilan annuel', prescription: 'Bilan sanguin recommandé' }
    ];
  }

  async getDocuments(phone: string): Promise<any[]> {
    return [];
  }

  async uploadDocument(data: any): Promise<any> {
    return { success: true, message: 'Document uploadé avec succès' };
  }
}