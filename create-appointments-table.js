const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

const sql = `CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  doctorId INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'en attente',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.run(sql, (err) => {
  if (err) {
    console.log('❌ Erreur:', err.message);
  } else {
    console.log('✅ Table appointments créée avec succès');
  }
  db.close();
});