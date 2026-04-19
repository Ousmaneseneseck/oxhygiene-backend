const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

db.run('ALTER TABLE users ADD COLUMN specialty VARCHAR', (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('✅ La colonne specialty existe déjà');
    } else {
      console.log('❌ Erreur:', err.message);
    }
  } else {
    console.log('✅ Colonne specialty ajoutée avec succès');
  }
  db.close();
});
