const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

const columns = [
  'birthDate',
  'address', 
  'city',
  'postalCode',
  'emergencyPhone',
  'insuranceNumber',
  'socialSecurityNumber'
];

columns.forEach(col => {
  db.run(`ALTER TABLE users ADD COLUMN ${col} VARCHAR`, (err) => {
    if (err && err.message.includes('duplicate column name')) {
      console.log(`⚠️ ${col} existe déjà`);
    } else if (err) {
      console.log(`❌ ${col}: ${err.message}`);
    } else {
      console.log(`✅ ${col} ajouté`);
    }
  });
});

setTimeout(() => db.close(), 1000);