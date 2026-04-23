import { Injectable } from '@nestjs/common';

export interface VitalSign {
  id: string;
  patientPhone: string;
  type: string;
  value: number;
  unit: string;
  measuredAt: Date;
}

@Injectable()
export class HealthService {
  private vitalSigns: VitalSign[] = [];

  async addVitalSign(data: any): Promise<VitalSign> {
    const vitalSign: VitalSign = {
      id: Date.now().toString(),
      patientPhone: data.patientPhone,
      type: data.type,
      value: data.value,
      unit: data.unit || '',
      measuredAt: new Date(),
    };
    this.vitalSigns.push(vitalSign);
    return vitalSign;
  }

  async getVitalSigns(patientPhone: string, type?: string): Promise<VitalSign[]> {
    let result = this.vitalSigns.filter(v => v.patientPhone === patientPhone);
    if (type) {
      result = result.filter(v => v.type === type);
    }
    return result.sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());
  }

  async getLatestVitalSign(patientPhone: string, type: string): Promise<VitalSign | null> {
    const signs = await this.getVitalSigns(patientPhone, type);
    return signs.length > 0 ? signs[0] : null;
  }
}
