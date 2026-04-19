const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

const sql = `CREATE TABLE IF NOT EXISTS health_measures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL,
  value TEXT,
  systolic TEXT,
  diastolic TEXT,
  unit TEXT,
  measuredAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.run(sql, (err) => {
  if (err) {
    console.log('❌ Erreur:', err.message);
  } else {
    console.log('✅ Table health_measures créée avec succès');
  }
  db.close();
});