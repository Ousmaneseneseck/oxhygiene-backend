import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Patient : Créer un rendez-vous
  @Post('create')
  async create(
    @Request() req,
    @Body() body: { doctorId: number; date: string; time: string; reason: string }
  ) {
    console.log('📅 Création rendez-vous pour patient:', req.user.id);
    return this.appointmentsService.create(
      req.user.id,
      body.doctorId,
      body.date,
      body.time,
      body.reason
    );
  }

  // Patient : Voir ses rendez-vous
  @Get('my-appointments')
  async getMyAppointments(@Request() req) {
    return this.appointmentsService.getPatientAppointments(req.user.id);
  }

  // Médecin : Voir les rendez-vous qui lui sont destinés
  @Get('doctor-appointments')
  async getDoctorAppointments(@Request() req) {
    console.log('👨‍⚕️ Médecin consulte ses rendez-vous:', req.user.id);
    return this.appointmentsService.getDoctorAppointments(req.user.id);
  }

  // Médecin : Voir l'historique des patients consultés
  @Get('doctor-patients-history')
  async getDoctorPatientsHistory(@Request() req) {
    console.log('📋 Médecin consulte son historique patients:', req.user.id);
    return this.appointmentsService.getDoctorPatientsHistory(req.user.id);
  }

  // Médecin : Accepter ou refuser un rendez-vous
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    console.log(`📝 Mise à jour statut rendez-vous ${id} -> ${body.status}`);
    return this.appointmentsService.updateStatus(parseInt(id), body.status);
  }

  // Médecin : Ajouter des notes médicales et prescription
  @Put(':id/medical-notes')
  async updateMedicalNotes(
    @Param('id') id: string,
    @Body() body: { notes: string; prescription: string }
  ) {
    console.log(`📋 Ajout notes médicales pour rendez-vous ${id}`);
    return this.appointmentsService.updateMedicalNotes(parseInt(id), body.notes, body.prescription);
  }

  // Médecin/Patient : Voir les détails d'un rendez-vous spécifique
  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @Request() req) {
    const appointment = await this.appointmentsService.findById(parseInt(id));
    
    // Vérifier que l'utilisateur a le droit de voir ce rendez-vous
    if (appointment && (appointment.patientId === req.user.id || appointment.doctorId === req.user.id)) {
      return appointment;
    }
    return { error: 'Non autorisé' };
  }

  // Patient : Annuler un rendez-vous
  @Put(':id/cancel')
  async cancelAppointment(@Param('id') id: string, @Request() req) {
    const appointment = await this.appointmentsService.findById(parseInt(id));
    if (!appointment || appointment.patientId !== req.user.id) {
      return { error: 'Non autorisé' };
    }
    console.log(`❌ Patient annule rendez-vous ${id}`);
    return this.appointmentsService.cancelAppointment(parseInt(id));
  }

  // Médecin : Récupérer tous les rendez-vous d'un patient spécifique
  @Get('patient/:patientId/appointments')
  async getPatientAppointmentsByDoctor(
    @Param('patientId') patientId: string,
    @Request() req
  ) {
    // Vérifier que l'utilisateur est un médecin
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`👨‍⚕️ Médecin consulte les rendez-vous du patient ${patientId}`);
    return this.appointmentsService.getPatientAppointments(parseInt(patientId));
  }
}