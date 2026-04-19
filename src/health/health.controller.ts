import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  // Endpoint de test (sans authentification)
  @Post('test')
  async test(@Body() body: any) {
    console.log('✅ Test endpoint appelé');
    return { success: true, body };
  }

  // Patient : Ajouter une mesure pour soi-même
  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  async addMeasure(@Request() req, @Body() body: { 
    type: string; 
    value: string; 
    unit: string;
    systolic?: string;
    diastolic?: string;
    note?: string;
  }) {
    console.log('📊 Add measure appelé');
    console.log('User ID:', req.user?.id);
    console.log('Body:', body);
    
    const result = await this.healthService.addMeasure(
      req.user.id,
      body.type,
      body.value,
      body.unit,
      body.systolic,
      body.diastolic,
      body.note
    );
    return { success: true, data: result };
  }

  // Patient : Récupérer ses propres mesures
  @Get('my-measures')
  @UseGuards(AuthGuard('jwt'))
  async getMyMeasures(@Request() req) {
    return this.healthService.getUserMeasures(req.user.id);
  }

  // Patient : Récupérer ses mesures par type (pour graphiques)
  @Get('my-measures/:type')
  @UseGuards(AuthGuard('jwt'))
  async getMyMeasuresByType(@Request() req, @Param('type') type: string) {
    return this.healthService.getUserMeasuresByType(req.user.id, type);
  }

  // Médecin : Récupérer les mesures d'un patient spécifique
  @Get('patient-measures/:patientId')
  @UseGuards(AuthGuard('jwt'))
  async getPatientMeasures(@Param('patientId') patientId: string, @Request() req) {
    // Vérifier que l'utilisateur est un médecin
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`👨‍⚕️ Médecin consulte les mesures du patient ${patientId}`);
    return this.healthService.getUserMeasures(parseInt(patientId));
  }

  // Médecin : Récupérer les mesures d'un patient par type (pour graphiques)
  @Get('patient-measures-graph/:patientId/:type')
  @UseGuards(AuthGuard('jwt'))
  async getPatientMeasuresForGraph(
    @Param('patientId') patientId: string,
    @Param('type') type: string,
    @Request() req
  ) {
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`📊 Médecin consulte les graphiques du patient ${patientId} pour ${type}`);
    return this.healthService.getUserMeasuresByType(parseInt(patientId), type);
  }

  // Médecin : Ajouter une mesure pour un patient (consultation présentielle)
  @Post('add-for-patient')
  @UseGuards(AuthGuard('jwt'))
  async addMeasureForPatient(@Request() req, @Body() body: { 
    patientId: number; 
    type: string; 
    value: string; 
    unit: string;
    systolic?: string;
    diastolic?: string;
    note?: string;
  }) {
    // Vérifier que l'utilisateur est un médecin
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`👨‍⚕️ Médecin ajoute une mesure pour le patient ${body.patientId}`);
    console.log('Mesure:', body);
    
    const result = await this.healthService.addMeasure(
      body.patientId,
      body.type,
      body.value,
      body.unit,
      body.systolic,
      body.diastolic,
      body.note
    );
    return { success: true, data: result };
  }

  // Récupérer la dernière mesure d'un patient par type
  @Get('last-measure/:patientId/:type')
  @UseGuards(AuthGuard('jwt'))
  async getLastMeasure(
    @Param('patientId') patientId: string,
    @Param('type') type: string,
    @Request() req
  ) {
    if (req.user.role !== 'doctor' && parseInt(patientId) !== req.user.id) {
      return { error: 'Non autorisé' };
    }
    return this.healthService.getLatestMeasure(parseInt(patientId), type);
  }

  // Supprimer une mesure (admin ou propriétaire)
  @Post('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteMeasure(@Param('id') id: string, @Request() req) {
    return this.healthService.deleteMeasure(parseInt(id), req.user.id);
  }

  // Récupérer les mesures dans une plage de dates
  @Post('range/:patientId')
  @UseGuards(AuthGuard('jwt'))
  async getMeasuresByDateRange(
    @Param('patientId') patientId: string,
    @Body() body: { startDate: string; endDate: string },
    @Request() req
  ) {
    if (req.user.role !== 'doctor' && parseInt(patientId) !== req.user.id) {
      return { error: 'Non autorisé' };
    }
    return this.healthService.getMeasuresByDateRange(
      parseInt(patientId),
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  // Récupérer la moyenne d'une mesure sur une période
  @Get('average/:patientId/:type/:days')
  @UseGuards(AuthGuard('jwt'))
  async getAverageMeasure(
    @Param('patientId') patientId: string,
    @Param('type') type: string,
    @Param('days') days: string,
    @Request() req
  ) {
    if (req.user.role !== 'doctor' && parseInt(patientId) !== req.user.id) {
      return { error: 'Non autorisé' };
    }
    const average = await this.healthService.getAverageMeasure(
      parseInt(patientId),
      type,
      parseInt(days)
    );
    return { average, type, days: parseInt(days) };
  }
}