const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

db.run('ALTER TABLE health_measures ADD COLUMN systolic VARCHAR', (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.log('❌ Erreur systolic:', err.message);
  } else if (err && err.message.includes('duplicate column name')) {
    console.log('✅ colonne systolic existe déjà');
  } else {
    console.log('✅ colonne systolic ajoutée');
  }
});

db.run('ALTER TABLE health_measures ADD COLUMN diastolic VARCHAR', (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.log('❌ Erreur diastolic:', err.message);
  } else if (err && err.message.includes('duplicate column name')) {
    console.log('✅ colonne diastolic existe déjà');
  } else {
    console.log('✅ colonne diastolic ajoutée');
  }
});

setTimeout(() => db.close(), 1000);