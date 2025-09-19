const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'MDN_SUITE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Middleware
app.use(cors());
app.use(express.json());

// Pool de connexions
const pool = mysql.createPool(dbConfig);

// Routes API

// Récupérer toutes les tâches
app.get('/api/tasks', async (req, res) => {
  try {
    const { projectId } = req.query;
    
    const query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.assigned_to,
        t.created_by,
        t.project_id,
        t.due_date,
        t.start_date,
        t.estimated_hours,
        t.actual_hours,
        t.created_at,
        t.updated_at,
        assigned_user.id as assigned_user_id,
        assigned_user.first_name as assigned_user_first_name,
        assigned_user.last_name as assigned_user_last_name,
        assigned_user.email as assigned_user_email,
        creator.id as creator_id,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        creator.email as creator_email
      FROM tasks t
      LEFT JOIN employees assigned_user ON t.assigned_to = assigned_user.id
      LEFT JOIN employees creator ON t.created_by = creator.id
      WHERE t.project_id = ? OR ? = 'default-project'
      ORDER BY t.created_at DESC
    `;
    
    const [rows] = await pool.execute(query, [projectId || 'default-project', projectId || 'default-project']);
    
    // Transformer les résultats
    const tasks = rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      project_id: row.project_id?.toString() || projectId || 'default-project',
      created_by: row.created_by?.toString() || '1',
      due_date: row.due_date || '',
      created_at: row.created_at,
      updated_at: row.updated_at,
      assigned_user: row.assigned_user_id ? {
        id: row.assigned_user_id.toString(),
        first_name: row.assigned_user_first_name,
        last_name: row.assigned_user_last_name,
        email: row.assigned_user_email
      } : undefined,
      creator: row.creator_id ? {
        id: row.creator_id.toString(),
        first_name: row.creator_first_name,
        last_name: row.creator_last_name,
        email: row.creator_email
      } : undefined
    }));
    
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une nouvelle tâche
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, assigned_to, created_by, project_id, due_date } = req.body;
    
    const query = `
      INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, project_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      title,
      description || '',
      status || 'todo',
      priority || 'medium',
      assigned_to ? parseInt(assigned_to) : null,
      parseInt(created_by),
      project_id ? parseInt(project_id) : null,
      due_date || null
    ]);
    
    res.json({ id: result.insertId, message: 'Tâche créée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'une tâche
app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const query = 'UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?';
    await pool.execute(query, [status, parseInt(id)]);
    
    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les employés
app.get('/api/employees', async (req, res) => {
  try {
    const query = 'SELECT * FROM employees ORDER BY first_name, last_name';
    const [rows] = await pool.execute(query);
    
    const employees = rows.map(row => ({
      id: row.id.toString(),
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      department: row.department,
      position: row.position,
      status: row.status,
      hire_date: row.hire_date,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
    
    res.json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== GESTION DES UTILISATEURS =====

// Récupérer tous les utilisateurs (admin seulement)
app.get('/api/users', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.created_at,
        u.updated_at,
        u.must_change_password,
        e.first_name,
        e.last_name,
        e.department,
        e.position
      FROM users u
      LEFT JOIN employees e ON u.email = e.email
      ORDER BY u.created_at DESC
    `;
    
    const [rows] = await pool.execute(query);
    
    const users = rows.map(row => ({
      id: row.id.toString(),
      email: row.email,
      name: row.name,
      role: row.role,
      first_name: row.first_name,
      last_name: row.last_name,
      department: row.department,
      position: row.position,
      must_change_password: row.must_change_password,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un nouvel utilisateur (admin seulement)
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, role, password, employee_id } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }
    
    // Créer l'utilisateur avec mot de passe initial
    const query = `
      INSERT INTO users (email, name, role, password_hash, must_change_password)
      VALUES (?, ?, ?, ?, 1)
    `;
    
    // Pour la démo, on utilise le mot de passe en clair (en production, utiliser bcrypt)
    const [result] = await pool.execute(query, [
      email,
      name,
      role || 'employee',
      password // En production, hasher avec bcrypt
    ]);
    
    res.json({ 
      id: result.insertId, 
      message: 'Utilisateur créé avec succès',
      must_change_password: true
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Authentification utilisateur
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const query = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.password_hash,
        u.must_change_password,
        e.first_name,
        e.last_name,
        e.department,
        e.position
      FROM users u
      LEFT JOIN employees e ON u.email = e.email
      WHERE u.email = ?
    `;
    
    const [rows] = await pool.execute(query, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const user = rows[0];
    
    // Vérifier le mot de passe (en production, utiliser bcrypt.compare)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Retourner les informations utilisateur (sans le mot de passe)
    const userInfo = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      department: user.department,
      position: user.position,
      must_change_password: user.must_change_password
    };
    
    res.json(userInfo);
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Changer le mot de passe
app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Vérifier l'utilisateur actuel
    const [userRows] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [id]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const user = userRows[0];
    
    // Vérifier le mot de passe actuel (en production, utiliser bcrypt.compare)
    if (user.password_hash !== currentPassword) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
    
    // Mettre à jour le mot de passe
    const updateQuery = `
      UPDATE users 
      SET password_hash = ?, must_change_password = 0, updated_at = NOW()
      WHERE id = ?
    `;
    
    await pool.execute(updateQuery, [newPassword, id]); // En production, hasher avec bcrypt
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un utilisateur (admin seulement)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
});

module.exports = app;
