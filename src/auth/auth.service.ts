import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.createUser(phone);
    }

    await this.usersService.saveOtp(phone, otp);
    console.log(`📱 OTP pour ${phone}: ${otp}`);

    return { message: 'OTP envoyé avec succès' };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ access_token: string; role: string }> {
    // CODE DE TEST - Accepter 000000 pour tous les numéros en test
    const isTestCode = otp === '000000';

    let isValid = false;

    if (isTestCode) {
      isValid = true;
      console.log(`🔓 CODE TEST utilisé pour ${phone}`);
    } else {
      isValid = await this.usersService.verifyOtp(phone, otp);
    }

    if (!isValid) {
      throw new UnauthorizedException('OTP invalide ou expiré');
    }

    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Si l'utilisateur n'a pas de nom, lui donner un nom par défaut basé sur le rôle
    if (!user.name) {
      if (user.role === 'doctor') {
        if (phone === '+221779999999') {
          await this.usersService.updateProfile(user.id, { 
            name: 'Dr. Fall', 
            email: 'dr.fall@oxhygiene.com', 
            bloodType: 'O+', 
            specialty: 'Médecine Générale' 
          });
        } else if (phone === '+221779999991') {
          await this.usersService.updateProfile(user.id, { 
            name: 'Dr. Sophie Martin', 
            email: 'sophie.martin@oxhygiene.com', 
            bloodType: 'A+', 
            specialty: 'Cardiologie' 
          });
        } else if (phone === '+221779999992') {
          await this.usersService.updateProfile(user.id, { 
            name: 'Dr. Amadou Diop', 
            email: 'amadou.diop@oxhygiene.com', 
            bloodType: 'O+', 
            specialty: 'Pédiatrie' 
          });
        } else {
          await this.usersService.updateProfile(user.id, { 
            name: 'Dr. Médecin', 
            email: '', 
            bloodType: '', 
            specialty: 'Généraliste' 
          });
        }
      } else {
        await this.usersService.updateProfile(user.id, { 
          name: 'Patient', 
          email: '', 
          bloodType: '', 
          specialty: '' 
        });
      }
      // Recharger l'utilisateur après mise à jour
      const updatedUser = await this.usersService.findByPhone(phone);
      if (!updatedUser) {
        throw new UnauthorizedException('Utilisateur non trouvé après mise à jour');
      }
      user = updatedUser;
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    console.log(`🔐 Connexion réussie pour ${phone} avec rôle ${user.role}`);

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}