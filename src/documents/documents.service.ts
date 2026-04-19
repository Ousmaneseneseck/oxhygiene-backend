import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async uploadDocument(
    userId: number,
    file: any,
    description: string,
    documentType: string,
    senderRole: string,
    senderName: string,
    patientId?: number,
  ) {
    const targetPatientId = patientId || userId;
    
    const document = this.documentsRepository.create({
      userId: targetPatientId,
      patientId: targetPatientId,
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      description,
      documentType,
      senderRole,
      senderName,
    });
    
    console.log(`📄 Document sauvegardé: ${file.originalname} pour patient ${targetPatientId}`);
    return this.documentsRepository.save(document);
  }

  async getUserDocuments(userId: number) {
    return this.documentsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPatientDocuments(patientId: number) {
    return this.documentsRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async getDocumentsByType(userId: number, documentType: string) {
    return this.documentsRepository.find({
      where: { userId, documentType },
      order: { createdAt: 'DESC' },
    });
  }

  async getDocumentById(id: number) {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async deleteDocument(id: number, userId: number, userRole: string) {
    const doc = await this.documentsRepository.findOne({ where: { id } });
    if (!doc) {
      return { error: 'Document non trouvé' };
    }
    
    // Vérifier les permissions: le propriétaire ou le médecin
    if (doc.userId !== userId && userRole !== 'doctor') {
      return { error: 'Non autorisé' };
    }
    
    // Supprimer le fichier physique
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
      console.log(`🗑️ Fichier supprimé: ${doc.filePath}`);
    }
    
    await this.documentsRepository.delete(id);
    return { success: true, message: 'Document supprimé' };
  }

  async updateDocumentDescription(id: number, description: string, userId: number) {
    const doc = await this.documentsRepository.findOne({ where: { id } });
    if (!doc) {
      return { error: 'Document non trouvé' };
    }
    if (doc.userId !== userId) {
      return { error: 'Non autorisé' };
    }
    
    await this.documentsRepository.update({ id }, { description });
    return this.getDocumentById(id);
  }

  async getDocumentsBySender(userId: number, senderRole: string) {
    return this.documentsRepository.find({
      where: { userId, senderRole },
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentDocuments(userId: number, limit: number = 10) {
    return this.documentsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async countDocumentsByType(userId: number) {
    const documents = await this.getUserDocuments(userId);
    const counts: Record<string, number> = {};
    
    documents.forEach(doc => {
      counts[doc.documentType] = (counts[doc.documentType] || 0) + 1;
    });
    
    return counts;
  }
}