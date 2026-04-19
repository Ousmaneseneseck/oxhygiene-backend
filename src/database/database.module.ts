import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { HealthMeasure } from '../health/health.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Document } from '../documents/document.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_URL', 'oxhygiene.db'),
        entities: [
          User,
          HealthMeasure,
          Appointment,
          Document,
        ],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}