const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// Voir les utilisateurs avant modification
console.log('=== AVANT MODIFICATION ===');
db.all("SELECT id, phone, role FROM users", (err, rows) => {
  if (err) {
    console.error('Erreur:', err);
    db.close();
    return;
  }
  console.table(rows);
  
  // Mettre à jour le rôle de l'utilisateur avec le numéro +221789999999 (médecin)
  db.run("UPDATE users SET role = 'doctor' WHERE phone = '+221789999999'", function(err) {
    if (err) {
      console.error('Erreur mise à jour:', err);
    } else {
      console.log(`\n✅ ${this.changes} utilisateur(s) mis à jour (médecin)\n`);
    }
    
    // Mettre à jour le rôle de l'utilisateur avec le numéro +221771234567 (patient)
    db.run("UPDATE users SET role = 'patient' WHERE phone = '+221771234567'", function(err) {
      if (err) {
        console.error('Erreur mise à jour patient:', err);
      } else {
        console.log(`✅ ${this.changes} utilisateur(s) mis à jour (patient)\n`);
      }
      
      // Voir les utilisateurs après modification
      console.log('=== APRÈS MODIFICATION ===');
      db.all("SELECT id, phone, role FROM users", (err, rows) => {
        if (err) {
          console.error('Erreur:', err);
        } else {
          console.table(rows);
        }
        db.close();
        console.log('\n✅ Base de données mise à jour avec succès !');
      });
    });
  });
});