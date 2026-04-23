import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException, Req } from '@nestjs/common';
import { PatientService } from './patient.service';

class CreatePatientProfileDto {
  fullname: string;
  email: string;
  phone: string;
}

@Controller('api/patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('profile')
  async createProfile(@Body() dto: CreatePatientProfileDto, @Headers('authorization') auth: string) {
    let userId = dto.phone;
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        userId = payload.sub || payload.phone;
      } catch(e) {}
    }
    return this.patientService.createProfile(userId, dto);
  }

  @Get('profile/:phone')
  async getProfile(@Param('phone') phone: string) {
    const profile = await this.patientService.getProfile(phone);
    if (!profile) {
      return { phone, fullname: '', email: '' };
    }
    return profile;
  }

  @Get('appointments/:phone')
  async getAppointments(@Param('phone') phone: string) {
    return this.patientService.getAppointments(phone);
  }

  @Get('consultations/:phone')
  async getConsultations(@Param('phone') phone: string) {
    return this.patientService.getConsultations(phone);
  }

  @Get('documents/:phone')
  async getDocuments(@Param('phone') phone: string) {
    return this.patientService.getDocuments(phone);
  }

  @Post('documents/upload')
  async uploadDocument(@Body() body: any, @Req() req: any) {
    return this.patientService.uploadDocument(body);
  }
}