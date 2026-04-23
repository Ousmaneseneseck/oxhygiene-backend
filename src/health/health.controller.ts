import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('measure')
  async addMeasure(@Body() body: any, @Request() req) {
    const patientPhone = body.patientPhone || req.headers['x-user-phone'];
    return this.healthService.addVitalSign({
      patientPhone,
      type: body.type,
      value: body.value,
      unit: body.unit,
    });
  }

  @Get('measures/:patientPhone')
  async getMeasures(@Param('patientPhone') patientPhone: string, @Query('type') type: string) {
    return this.healthService.getVitalSigns(patientPhone, type);
  }

  @Get('latest/:patientPhone/:type')
  async getLatest(@Param('patientPhone') patientPhone: string, @Param('type') type: string) {
    return this.healthService.getLatestVitalSign(patientPhone, type);
  }
}
