const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// Mettre à jour les spécialités
db.run("UPDATE users SET specialty = 'Médecine Générale' WHERE id = 2", (err) => {
  if (err) console.log('Erreur id 2:', err.message);
  else console.log('✅ Dr. Fall mis à jour');
});

db.run("UPDATE users SET specialty = 'Cardiologie' WHERE id = 3", (err) => {
  if (err) console.log('Erreur id 3:', err.message);
  else console.log('✅ Dr. Sophie Martin mise à jour');
});

db.run("UPDATE users SET specialty = 'Pédiatrie' WHERE id = 4", (err) => {
  if (err) console.log('Erreur id 4:', err.message);
  else console.log('✅ Dr. Amadou Diop mis à jour');
});

// Vérifier les résultats
setTimeout(() => {
  db.all("SELECT id, name, specialty FROM users WHERE role = 'doctor'", (err, rows) => {
    if (err) {
      console.log('Erreur lecture:', err.message);
    } else {
      console.log('\n📋 Médecins après mise à jour:');
      rows.forEach(row => {
        console.log(`   ${row.id}: ${row.name} - ${row.specialty}`);
      });
    }
    db.close();
  });
}, 500);