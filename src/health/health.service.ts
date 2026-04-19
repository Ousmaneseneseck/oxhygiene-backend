import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { HealthMeasure } from './health.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthMeasure)
    private healthRepository: Repository<HealthMeasure>,
  ) {}

  // Ajouter une mesure
  async addMeasure(
    userId: number, 
    type: string, 
    value: string, 
    unit: string, 
    systolic?: string, 
    diastolic?: string,
    note?: string
  ) {
    console.log('📝 Service addMeasure - Début');
    
    const measure = this.healthRepository.create({ 
      userId, 
      type, 
      value, 
      unit,
      systolic,
      diastolic,
      note
    });
    
    console.log('Mesure créée:', measure);
    
    try {
      const saved = await this.healthRepository.save(measure);
      console.log('✅ Sauvegardé:', saved);
      return saved;
    } catch (error) {
      console.error('❌ Erreur de sauvegarde:', error.message);
      throw error;
    }
  }

  // Récupérer toutes les mesures d'un utilisateur
  async getUserMeasures(userId: number) {
    return this.healthRepository.find({ 
      where: { userId }, 
      order: { measuredAt: 'DESC' } 
    });
  }

  // Récupérer les mesures d'un utilisateur par type
  async getUserMeasuresByType(userId: number, type: string) {
    return this.healthRepository.find({ 
      where: { userId, type }, 
      order: { measuredAt: 'DESC' } 
    });
  }

  // Récupérer la dernière mesure d'un type
  async getLatestMeasure(userId: number, type: string) {
    return this.healthRepository.findOne({ 
      where: { userId, type }, 
      order: { measuredAt: 'DESC' } 
    });
  }

  // Récupérer les mesures dans une plage de dates
  async getMeasuresByDateRange(userId: number, startDate: Date, endDate: Date) {
    return this.healthRepository.find({
      where: {
        userId,
        measuredAt: Between(startDate, endDate)
      },
      order: { measuredAt: 'DESC' }
    });
  }

  // Récupérer les mesures depuis une date
  async getMeasuresSince(userId: number, type: string, days: number) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    
    const where: any = { userId, measuredAt: MoreThan(sinceDate) };
    if (type) where.type = type;
    
    return this.healthRepository.find({
      where,
      order: { measuredAt: 'DESC' }
    });
  }

  // Récupérer la moyenne d'une mesure sur une période
  async getAverageMeasure(userId: number, type: string, days: number) {
    const measures = await this.getMeasuresSince(userId, type, days);
    
    if (measures.length === 0) return null;
    
    let sum = 0;
    let count = 0;
    
    measures.forEach(measure => {
      let numValue = 0;
      if (measure.type === 'tension' && measure.systolic) {
        numValue = parseFloat(measure.systolic);
      } else if (measure.value) {
        numValue = parseFloat(measure.value);
      }
      
      if (!isNaN(numValue)) {
        sum += numValue;
        count++;
      }
    });
    
    return count > 0 ? sum / count : null;
  }

  // Récupérer les valeurs min et max pour un type
  async getMinMaxValues(userId: number, type: string, days: number) {
    const measures = await this.getMeasuresSince(userId, type, days);
    
    if (measures.length === 0) return { min: null, max: null };
    
    let min = Infinity;
    let max = -Infinity;
    
    measures.forEach(measure => {
      let value = 0;
      if (measure.type === 'tension' && measure.systolic) {
        value = parseFloat(measure.systolic);
      } else if (measure.value) {
        value = parseFloat(measure.value);
      }
      
      if (!isNaN(value)) {
        if (value < min) min = value;
        if (value > max) max = value;
      }
    });
    
    return { min: min === Infinity ? null : min, max: max === -Infinity ? null : max };
  }

  // Récupérer les mesures avec alerte (hors seuils)
  async getAlertMeasures(userId: number, type: string, seuilMin: number, seuilMax: number) {
    const measures = await this.getUserMeasuresByType(userId, type);
    
    return measures.filter(measure => {
      let value = 0;
      if (measure.type === 'tension' && measure.systolic) {
        value = parseFloat(measure.systolic);
      } else if (measure.value) {
        value = parseFloat(measure.value);
      }
      return !isNaN(value) && (value < seuilMin || value > seuilMax);
    });
  }

  // Supprimer une mesure (admin ou propriétaire)
  async deleteMeasure(id: number, userId: number) {
    const measure = await this.healthRepository.findOne({ where: { id, userId } });
    if (!measure) {
      return { error: 'Mesure non trouvée ou non autorisée' };
    }
    await this.healthRepository.delete(id);
    return { success: true, message: 'Mesure supprimée' };
  }

  // Compter le nombre de mesures par type
  async countMeasuresByType(userId: number) {
    const measures = await this.getUserMeasures(userId);
    const counts: Record<string, number> = {};
    
    measures.forEach(measure => {
      counts[measure.type] = (counts[measure.type] || 0) + 1;
    });
    
    return counts;
  }

  // Récupérer les statistiques globales d'un patient
  async getPatientStats(userId: number) {
    const measures = await this.getUserMeasures(userId);
    
    const stats: Record<string, any> = {};
    const types = ['tension', 'glycemie', 'cardiaque', 'temperature', 'oxygenation', 'poids'];
    
    for (const type of types) {
      const typeMeasures = measures.filter(m => m.type === type);
      if (typeMeasures.length > 0) {
        let values: number[] = [];
        typeMeasures.forEach(m => {
          let val = 0;
          if (type === 'tension' && m.systolic) {
            val = parseFloat(m.systolic);
          } else if (m.value) {
            val = parseFloat(m.value);
          }
          if (!isNaN(val)) values.push(val);
        });
        
        if (values.length > 0) {
          stats[type] = {
            count: values.length,
            last: values[values.length - 1],
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values)
          };
        }
      }
    }
    
    return stats;
  }
}