const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function seedMedecins() {
  const app = await NestFactory.create(AppModule);
  const medecinService = app.get('MedecinService');

  const medecins = [
    { phone: '+221779999999', fullname: 'Dr. Ousmane Fall', specialty: 'Médecine Générale', experience: 12, consultationFee: 5000, languages: 'Français, Wolof', bio: 'Généraliste expérimenté' },
    { phone: '+221779999991', fullname: 'Dr. Sophie Martin', specialty: 'Cardiologie', experience: 15, consultationFee: 10000, languages: 'Français, Anglais', bio: 'Cardiologue interventionnelle' },
    { phone: '+221779999992', fullname: 'Dr. Fatima Sow', specialty: 'Gynécologie', experience: 8, consultationFee: 8000, languages: 'Français, Anglais, Wolof', bio: 'Gynécologue-obstétricienne' },
    { phone: '+221779999993', fullname: 'Dr. Amadou Diop', specialty: 'Pédiatrie', experience: 10, consultationFee: 6000, languages: 'Français, Wolof', bio: 'Pédiatre depuis 10 ans' }
  ];

  for (const m of medecins) {
    await medecinService.createProfile(m.phone, m, m.phone);
    console.log(✅ Ajouté : );
  }

  console.log('✅ Tous les médecins de test ont été ajoutés');
  await app.close();
}

seedMedecins().catch(console.error);
