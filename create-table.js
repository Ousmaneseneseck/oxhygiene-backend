const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

const createTableSQL = `
CREATE TABLE IF NOT EXISTS health_measures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type VARCHAR NOT NULL,
  value VARCHAR,
  unit VARCHAR,
  measuredAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.log('❌ Erreur:', err.message);
  } else {
    console.log('✅ Table health_measures créée avec succès');
  }
});

setTimeout(() => db.close(), 1000);