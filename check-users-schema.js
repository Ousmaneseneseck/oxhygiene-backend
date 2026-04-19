const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

db.all("PRAGMA table_info(users)", (err, rows) => {
  if (err) {
    console.log('Erreur:', err.message);
  } else {
    console.log('Colonnes de la table users:');
    rows.forEach(row => {
      console.log(` - ${row.name} (${row.type})`);
    });
  }
  db.close();
});