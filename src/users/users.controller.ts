import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Récupérer tous les patients
  @Get()
  async findAll() {
    return this.usersService.findByRole('patient');
  }

  // Récupérer tous les médecins (pour la liste déroulante)
  @Get('doctors')
  async getDoctors() {
    console.log('📋 Liste des médecins demandée');
    return this.usersService.findByRole('doctor');
  }

  // Changer le rôle d'un utilisateur
  @Post('role')
  async updateRole(@Body('userId') userId: number, @Body('role') role: string) {
    await this.usersService.updateRole(userId, role);
    return { message: 'Rôle mis à jour' };
  }

  // Corriger le rôle du médecin (nettoie les doublons)
  @Post('fix-doctor-role')
  async fixDoctorRole() {
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Rôle médecin corrigé' };
  }

  // Nettoyer les doublons
  @Post('clean-duplicates')
  async cleanDuplicates() {
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Doublons nettoyés' };
  }

  // Forcer le rôle médecin (pour test)
  @Post('force-doctor')
  async forceDoctor() {
    await this.usersService.updateRole(1, 'doctor');
    return { message: 'Force doctor role' };
  }

  // Mettre à jour le profil de l'utilisateur connecté
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