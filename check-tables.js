const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.log('Erreur:', err.message);
  } else {
    console.log('Tables dans la base:');
    rows.forEach(row => console.log(' -', row.name));
  }
  db.close();
});