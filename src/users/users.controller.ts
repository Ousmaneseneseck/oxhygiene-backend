import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findByRole('patient');
  }

  @Get('doctors')
  async getDoctors() {
    return this.usersService.findByRole('doctor');
  }

  @Post('role')
  async updateRole(@Body('userId') userId: number, @Body('role') role: string) {
    await this.usersService.updateRole(userId, role);
    return { message: 'Rôle mis à jour' };
  }

  @Post('fix-doctor-role')
  async fixDoctorRole() {
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Rôle médecin corrigé' };
  }

  @Post('clean-duplicates')
  async cleanDuplicates() {
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Doublons nettoyés' };
  }

  @Post('force-doctor')
  async forceDoctor() {
    await this.usersService.updateRole(1, 'doctor');
    return { message: 'Force doctor role' };
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req, @Body() body: { 
    name: string; 
    email: string; 
    bloodType: string; 
    specialty: string 
  }) {
    console.log('📝 Mise à jour profil reçue:', body);
    const result = await this.usersService.updateProfile(req.user.id, body);
    console.log('✅ Profil mis à jour:', result);
    return result;
  }
}