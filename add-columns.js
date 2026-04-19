const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'oxhygiene.db');
const db = new sqlite3.Database(dbPath);

const columns = [
  { name: 'name', type: 'VARCHAR' },
  { name: 'email', type: 'VARCHAR' },
  { name: 'bloodType', type: 'VARCHAR' }
];

columns.forEach(col => {
  db.run(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log(`✅ Colonne ${col.name} existe déjà`);
      } else {
        console.log(`❌ Erreur pour ${col.name}:`, err.message);
      }
    } else {
      console.log(`✅ Colonne ${col.name} ajoutée avec succès`);
    }
  });
});

setTimeout(() => db.close(), 1000);