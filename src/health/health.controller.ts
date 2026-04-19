import { Controller, Post, Get, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  // ============================================
  // ROUTES COMPATIBLES AVEC LE FRONTEND (React)
  // ============================================

  // Patient : Ajouter une mesure (frontend appelle /add)
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
    console.log('📊 [ADD] Mesure ajoutée par patient:', req.user.id);
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

  // Patient : Récupérer ses mesures (frontend appelle /my-measures)
  @Get('my-measures')
  @UseGuards(AuthGuard('jwt'))
  async getMyMeasures(@Request() req) {
    console.log('📊 [MY-MEASURES] Récupération des mesures pour patient:', req.user.id);
    return this.healthService.getUserMeasures(req.user.id);
  }

  // Patient : Récupérer ses mesures par type pour graphiques (frontend appelle /my-measures/:type)
  @Get('my-measures/:type')
  @UseGuards(AuthGuard('jwt'))
  async getMyMeasuresByType(@Request() req, @Param('type') type: string) {
    console.log(`📊 [MY-MEASURES/:TYPE] Récupération des mesures de type ${type} pour patient: ${req.user.id}`);
    return this.healthService.getUserMeasuresByType(req.user.id, type);
  }

  // ============================================
  // ROUTES EXISTANTES (compatibilité)
  // ============================================

  // Endpoint de test
  @Post('test')
  async test(@Body() body: any) {
    console.log('✅ Test endpoint appelé');
    return { success: true, body };
  }

  // Route existante: POST /health/measure
  @Post('measure')
  @UseGuards(AuthGuard('jwt'))
  async addMeasureLegacy(@Request() req, @Body() body: any) {
    console.log('📊 [MEASURE] Mesure ajoutée (legacy):', req.user.id);
    return this.healthService.addMeasure(
      req.user.id,
      body.type,
      body.value,
      body.unit,
      body.systolic,
      body.diastolic,
      body.note
    );
  }

  // Route existante: GET /health/measures
  @Get('measures')
  @UseGuards(AuthGuard('jwt'))
  async getMeasuresLegacy(@Request() req) {
    console.log('📊 [MEASURES] Récupération des mesures (legacy):', req.user.id);
    return this.healthService.getUserMeasures(req.user.id);
  }

  // Route existante: GET /health/stats (commentée temporairement)
  // @Get('stats')
  // @UseGuards(AuthGuard('jwt'))
  // async getStats(@Request() req) {
  //   return this.healthService.getUserStats(req.user.id);
  // }

  // Route existante: GET /health/latest (commentée temporairement)
  // @Get('latest')
  // @UseGuards(AuthGuard('jwt'))
  // async getLatest(@Request() req) {
  //   return this.healthService.getLatestMeasures(req.user.id);
  // }

  // ============================================
  // ROUTES POUR MÉDECINS
  // ============================================

  // Médecin : Récupérer les mesures d'un patient spécifique
  @Get('patient-measures/:patientId')
  @UseGuards(AuthGuard('jwt'))
  async getPatientMeasures(@Param('patientId') patientId: string, @Request() req) {
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`👨‍⚕️ Médecin consulte les mesures du patient ${patientId}`);
    return this.healthService.getUserMeasures(parseInt(patientId));
  }

  // Médecin : Récupérer les mesures d'un patient par type (graphiques)
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
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    console.log(`👨‍⚕️ Médecin ajoute une mesure pour le patient ${body.patientId}`);
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

  // Supprimer une mesure
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteMeasure(@Param('id') id: string, @Request() req) {
    return this.healthService.deleteMeasure(parseInt(id), req.user.id);
  }
}