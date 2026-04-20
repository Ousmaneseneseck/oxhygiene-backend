import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  // Créer un rendez-vous (patient)
  async create(patientId: number, doctorId: number, date: string, time: string, reason: string) {
    const appointment = this.appointmentsRepository.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: 'en attente'
    });
    console.log('📅 Nouveau rendez-vous créé:', appointment);
    return this.appointmentsRepository.save(appointment);
  }

  // Récupérer tous les rendez-vous d'un patient avec les infos du médecin
  async getPatientAppointments(patientId: number) {
    const appointments = await this.appointmentsRepository.find({
      where: { patientId },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['doctor']
    });
    
    // Enrichir avec les informations du médecin
    return appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      date: apt.date,
      time: apt.time,
      reason: apt.reason,
      status: apt.status,
      notes: apt.notes,
      prescription: apt.prescription,
      createdAt: apt.createdAt,
      // Informations du médecin
      doctorName: apt.doctor?.name || `Dr. ID ${apt.doctorId}`,
      doctorSpecialty: apt.doctor?.specialty || 'Médecin généraliste',
      doctorPhone: apt.doctor?.phone,
      doctorEmail: apt.doctor?.email
    }));
  }

  // Récupérer tous les rendez-vous d'un médecin avec les infos du patient
  async getDoctorAppointments(doctorId: number) {
    const appointments = await this.appointmentsRepository.find({
      where: { doctorId },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['patient']
    });
    
    // Enrichir avec les informations du patient
    return appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      date: apt.date,
      time: apt.time,
      reason: apt.reason,
      status: apt.status,
      notes: apt.notes,
      prescription: apt.prescription,
      createdAt: apt.createdAt,
      // Informations du patient
      patientName: apt.patient?.name || `Patient #${apt.patientId}`,
      patientPhone: apt.patient?.phone
    }));
  }

  // Récupérer l'historique des patients consultés par un médecin
  async getDoctorPatientsHistory(doctorId: number) {
    console.log(`📋 Récupération de l'historique des patients pour le médecin ${doctorId}`);
    
    const appointments = await this.appointmentsRepository.find({
      where: { doctorId },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['patient']
    });
    
    const patientsMap = new Map();
    
    appointments.forEach(apt => {
      if (!patientsMap.has(apt.patientId)) {
        patientsMap.set(apt.patientId, {
          id: apt.patientId,
          patientId: apt.patientId,
          name: apt.patient?.name || `Patient #${apt.patientId}`,
          phone: apt.patient?.phone,
          lastVisit: apt.date,
          totalVisits: 1,
          appointments: [apt]
        });
      } else {
        const existing = patientsMap.get(apt.patientId);
        existing.totalVisits++;
        if (apt.date > existing.lastVisit) existing.lastVisit = apt.date;
        existing.appointments.push(apt);
      }
    });
    
    return Array.from(patientsMap.values());
  }

  // Mettre à jour le statut d'un rendez-vous (médecin)
  async updateStatus(id: number, status: string) {
    await this.appointmentsRepository.update({ id }, { status });
    console.log(`✅ Rendez-vous ${id} -> statut: ${status}`);
    return this.findById(id);
  }

  // Ajouter des notes médicales et prescription (médecin)
  async updateMedicalNotes(id: number, notes: string, prescription: string) {
    await this.appointmentsRepository.update({ id }, { notes, prescription });
    console.log(`📝 Notes médicales ajoutées pour rendez-vous ${id}`);
    return this.findById(id);
  }

  // Récupérer un rendez-vous par son ID
  async findById(id: number) {
    return this.appointmentsRepository.findOne({ 
      where: { id },
      relations: ['doctor', 'patient']
    });
  }

  // Récupérer tous les rendez-vous (admin)
  async findAll() {
    return this.appointmentsRepository.find({
      order: { date: 'DESC', time: 'DESC' },
      relations: ['doctor', 'patient']
    });
  }

  // Annuler un rendez-vous
  async cancelAppointment(id: number) {
    await this.appointmentsRepository.update({ id }, { status: 'annulé' });
    console.log(`❌ Rendez-vous ${id} annulé`);
    return this.findById(id);
  }

  // Récupérer les rendez-vous par statut
  async getAppointmentsByStatus(status: string) {
    return this.appointmentsRepository.find({
      where: { status },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['doctor', 'patient']
    });
  }

  // Récupérer les rendez-vous d'un médecin par statut
  async getDoctorAppointmentsByStatus(doctorId: number, status: string) {
    return this.appointmentsRepository.find({
      where: { doctorId, status },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['patient']
    });
  }

  // Récupérer les rendez-vous d'un patient par statut
  async getPatientAppointmentsByStatus(patientId: number, status: string) {
    return this.appointmentsRepository.find({
      where: { patientId, status },
      order: { date: 'DESC', time: 'DESC' },
      relations: ['doctor']
    });
  }
}