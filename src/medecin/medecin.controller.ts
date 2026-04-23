import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { MedecinService, MedecinProfile } from './medecin.service';

class CreateMedecinProfileDto {
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
}

@Controller('api/medecin')
export class MedecinController {
  constructor(private readonly medecinService: MedecinService) {}

  @Post('profile')
  async createProfile(
    @Body() dto: CreateMedecinProfileDto,
    @Headers('authorization') auth: string,
    @Headers('x-phone') phone?: string
  ) {
    let userId = 'temp_' + Date.now();
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        userId = payload.sub || payload.phone;
        phone = payload.phone;
      } catch(e) {}
    }
    return this.medecinService.createProfile(userId, dto, phone);
  }

  @Get('profile')
  async getProfile(@Headers('authorization') auth: string) {
    let userId = 'unknown';
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        userId = payload.sub || payload.phone;
      } catch(e) {}
    }
    const profile = await this.medecinService.getProfile(userId);
    if (!profile) throw new UnauthorizedException('Profil non trouvé');
    return profile;
  }

  @Post('seed')
  async seedMedecins() {
    const medecinsList = [
      { phone: '+221779999999', fullname: 'Dr. Ousmane Fall', specialty: 'Medecine Generale', experience: 12, consultationFee: 5000, languages: 'Francais, Wolof', bio: 'Generaliste experimente' },
      { phone: '+221779999991', fullname: 'Dr. Sophie Martin', specialty: 'Cardiologie', experience: 15, consultationFee: 10000, languages: 'Francais, Anglais', bio: 'Cardiologue interventionnelle' },
      { phone: '+221779999992', fullname: 'Dr. Fatima Sow', specialty: 'Gynecologie', experience: 8, consultationFee: 8000, languages: 'Francais, Anglais, Wolof', bio: 'Gynecologue-obstetricienne' },
      { phone: '+221779999993', fullname: 'Dr. Amadou Diop', specialty: 'Pediatrie', experience: 10, consultationFee: 6000, languages: 'Francais, Wolof', bio: 'Pediatre depuis 10 ans' }
    ];

    const results: MedecinProfile[] = [];
    for (const m of medecinsList) {
      const existing = await this.medecinService.getProfile(m.phone);
      if (!existing) {
        const created = await this.medecinService.createProfile(m.phone, m, m.phone);
        results.push(created);
        console.log(`Ajoute: ${m.fullname}`);
      } else {
        console.log(`Existe deja: ${m.fullname}`);
      }
    }
    return { message: `${results.length} medecins ajoutes`, medecins: results };
  }

  @Get('list')
  async getAllMedecins() {
    return this.medecinService.getAllMedecins();
  }
}