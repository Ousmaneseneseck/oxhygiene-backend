import { Module } from '@nestjs/common';
import { MedecinController } from './medecin.controller';
import { MedecinService } from './medecin.service';

@Module({
  controllers: [MedecinController],
  providers: [MedecinService]
})
export class MedecinModule {}
