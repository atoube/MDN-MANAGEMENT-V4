const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de la base de données
const dbConfig = {
  host: 'db5017958553.hosting-data.io',
  port: 3306,
  user: 'dbu1050870',
  password: 'mdn_suite_001',
  database: 'dbs14285488', // Nom correct de la base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Middleware
app.use(cors());
app.use(express.json());

// Pool de connexions
let pool = null;

const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await getConnection();
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const user = users[0];
    
    // Pour le développement, accepter tous les mots de passe
    // En production, vérifier avec bcrypt
    const isValidPassword = true; // bcrypt.compareSync(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Retourner l'utilisateur sans le mot de passe
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const connection = await getConnection();
    
    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }
    
    // Hasher le mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insérer le nouvel utilisateur
    const [result] = await connection.execute(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name || '', role || 'employee']
    );
    
    // Récupérer l'utilisateur créé
    const [newUsers] = await connection.execute(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.json(newUsers[0]);
    
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes des modules
app.get('/api/modules', async (req, res) => {
  try {
    const connection = await getConnection();
    const [modules] = await connection.execute(
      'SELECT * FROM modules WHERE enabled = true ORDER BY order_index'
    );
    res.json(modules);
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes des employés
app.get('/api/employees', async (req, res) => {
  try {
    const connection = await getConnection();
    const [employees] = await connection.execute('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [employees] = await connection.execute(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );
    
    if (employees.length === 0) {
      return res.status(404).json({ error: 'Employé non trouvé' });
    }
    
    res.json(employees[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employeeData = req.body;
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO employees (first_name, last_name, email, phone, department, position, role, status, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.email,
        employeeData.phone,
        employeeData.department,
        employeeData.position,
        employeeData.role,
        employeeData.status || 'active',
        employeeData.salary,
        employeeData.hire_date
      ]
    );
    
    res.json({ id: result.insertId, ...employeeData });
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = req.body;
    const connection = await getConnection();
    
    await connection.execute(
      'UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ?, position = ?, role = ?, status = ?, salary = ?, hire_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.email,
        employeeData.phone,
        employeeData.department,
        employeeData.position,
        employeeData.role,
        employeeData.status,
        employeeData.salary,
        employeeData.hire_date,
        id
      ]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de test de connexion
app.get('/api/health', async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.execute('SELECT 1');
    res.json({ status: 'OK', message: 'Base de données connectée' });
  } catch (error) {
    console.error('Erreur de santé:', error);
    res.status(500).json({ status: 'ERROR', message: 'Erreur de connexion à la base de données' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
});
