const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto por tu usuario de MySQL
  password: '', // Cambia esto por tu contraseña de MySQL
  database: 'productos_db' // Cambia esto por el nombre de tu base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Prueba de consulta
connection.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('Error en la consulta de prueba:', err);
    return;
  }
  console.log('Prueba de consulta exitosa. Resultado:', results[0].solution);
});

module.exports = connection;