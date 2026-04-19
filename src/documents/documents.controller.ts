import { Controller, Post, Get, Delete, Put, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  // Upload d'un document
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Type de fichier non autorisé'), false);
      }
    },
  }))
  async uploadDocument(
    @Request() req,
    @UploadedFile() file,
    @Body('description') description: string,
    @Body('documentType') documentType: string,
    @Body('patientId') patientId: string,
  ) {
    console.log('📄 Upload document - User:', req.user.id, 'Role:', req.user.role);
    console.log('Fichier reçu:', file?.originalname);
    
    if (!file) {
      return { error: 'Aucun fichier reçu' };
    }
    
    const senderName = req.user.name || (req.user.role === 'doctor' ? 'Dr. Médecin' : 'Patient');
    
    const result = await this.documentsService.uploadDocument(
      req.user.id,
      file,
      description || '',
      documentType || 'autre',
      req.user.role,
      senderName,
      patientId ? parseInt(patientId) : undefined,
    );
    
    return { success: true, data: result };
  }

  // Récupérer mes documents (patient)
  @Get('my-documents')
  async getMyDocuments(@Request() req) {
    return this.documentsService.getUserDocuments(req.user.id);
  }

  // Récupérer les documents d'un patient (médecin uniquement)
  @Get('patient-documents/:patientId')
  async getPatientDocuments(@Param('patientId') patientId: string, @Request() req) {
    if (req.user.role !== 'doctor') {
      return { error: 'Non autorisé - Réservé aux médecins' };
    }
    return this.documentsService.getPatientDocuments(parseInt(patientId));
  }

  // Récupérer les documents par type
  @Get('by-type/:type')
  async getDocumentsByType(@Param('type') type: string, @Request() req) {
    return this.documentsService.getDocumentsByType(req.user.id, type);
  }

  // Récupérer les documents envoyés par le médecin
  @Get('from-doctor')
  async getDocumentsFromDoctor(@Request() req) {
    return this.documentsService.getDocumentsBySender(req.user.id, 'doctor');
  }

  // Récupérer les documents récents
  @Get('recent/:limit')
  async getRecentDocuments(@Param('limit') limit: string, @Request() req) {
    return this.documentsService.getRecentDocuments(req.user.id, parseInt(limit));
  }

  // Supprimer un document
  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Request() req) {
    return this.documentsService.deleteDocument(parseInt(id), req.user.id, req.user.role);
  }

  // Mettre à jour la description d'un document
  @Put(':id/description')
  async updateDescription(
    @Param('id') id: string,
    @Body('description') description: string,
    @Request() req,
  ) {
    return this.documentsService.updateDocumentDescription(parseInt(id), description, req.user.id);
  }

  // Compter les documents par type
  @Get('stats/counts')
  async getDocumentCounts(@Request() req) {
    return this.documentsService.countDocumentsByType(req.user.id);
  }
}