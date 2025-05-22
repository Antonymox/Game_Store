// Importar dependencias
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite solicitudes CORS desde Angular
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'tienda_gamer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rutas de API para juegos
app.get('/api/games', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, 
             GROUP_CONCAT(DISTINCT c.name) AS categories,
             GROUP_CONCAT(DISTINCT t.name) AS tags
      FROM games g
      LEFT JOIN game_categories gc ON g.id = gc.game_id
      LEFT JOIN categories c ON gc.category_id = c.id
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      GROUP BY g.id
      LIMIT 50
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Obtener un juego por ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, 
             GROUP_CONCAT(DISTINCT c.name) AS categories,
             GROUP_CONCAT(DISTINCT t.name) AS tags
      FROM games g
      LEFT JOIN game_categories gc ON g.id = gc.game_id
      LEFT JOIN categories c ON gc.category_id = c.id
      LEFT JOIN game_tags gt ON g.id = gt.game_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.id = ?
      GROUP BY g.id
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    res.status(500).json({ error: 'Error al obtener el juego' });
  }
});

// Rutas para usuarios (registro, login)
app.post('/api/users/register', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  try {
    // En producción, deberías hashear la contraseña antes de guardarla
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, firstName, lastName]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});