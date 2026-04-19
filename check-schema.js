const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

db.all("PRAGMA table_info(health_measures)", (err, rows) => {
  if (err) {
    console.log('Erreur:', err.message);
  } else {
    console.log('Structure de health_measures:');
    rows.forEach(row => console.log(` - ${row.name} (${row.type})`));
  }
  db.close();
});