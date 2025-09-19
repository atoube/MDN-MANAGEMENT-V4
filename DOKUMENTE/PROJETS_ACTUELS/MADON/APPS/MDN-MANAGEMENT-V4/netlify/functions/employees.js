const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
  port: process.env.RAILWAY_DB_PORT || 26824,
  user: process.env.RAILWAY_DB_USER || 'root',
  password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
  database: process.env.RAILWAY_DB_NAME || 'railway',
  ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    console.log('🔍 Fonction employees appelée:', event.httpMethod);
    
    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    let result;

    switch (event.httpMethod) {
      case 'GET':
        // Récupérer tous les employés (utilisateurs)
        const [rows] = await connection.execute(`
          SELECT 
            id,
            first_name,
            last_name,
            email,
            phone,
            department,
            position,
            role,
            status,
            salary,
            hire_date,
            photo_url,
            avatar_id,
            address,
            emergency_contact,
            emergency_phone,
            created_at,
            updated_at,
            must_change_password
          FROM users 
          ORDER BY created_at DESC
        `);
        
        console.log(`✅ ${rows.length} employés récupérés`);
        result = rows;
        break;

      case 'POST':
        // Créer un nouvel employé
        const newEmployee = JSON.parse(event.body);
        const [insertResult] = await connection.execute(`
          INSERT INTO users (
            first_name, last_name, email, phone, department, position, 
            role, status, salary, hire_date, address, emergency_contact, 
            emergency_phone, password, must_change_password
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          newEmployee.first_name,
          newEmployee.last_name,
          newEmployee.email,
          newEmployee.phone,
          newEmployee.department,
          newEmployee.position,
          newEmployee.role || 'employee',
          newEmployee.status || 'active',
          newEmployee.salary,
          newEmployee.hire_date,
          newEmployee.address,
          newEmployee.emergency_contact,
          newEmployee.emergency_phone,
          newEmployee.password || 'Start01!',
          newEmployee.must_change_password || true
        ]);
        
        console.log('✅ Nouvel employé créé:', insertResult.insertId);
        result = { id: insertResult.insertId, ...newEmployee };
        break;

      case 'PUT':
        // Mettre à jour un employé
        const employeeId = event.path.split('/').pop();
        const updateData = JSON.parse(event.body);
        
        const updateFields = [];
        const updateValues = [];
        
        Object.keys(updateData).forEach(key => {
          if (key !== 'id' && key !== 'created_at') {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        });
        
        if (updateFields.length > 0) {
          updateValues.push(employeeId);
          await connection.execute(`
            UPDATE users 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE id = ?
          `, updateValues);
          
          console.log('✅ Employé mis à jour:', employeeId);
          result = { id: employeeId, ...updateData };
        } else {
          result = { error: 'Aucune donnée à mettre à jour' };
        }
        break;

      case 'DELETE':
        // Supprimer un employé
        const deleteId = event.path.split('/').pop();
        
        // Vérifier que ce n'est pas un admin
        const [adminCheck] = await connection.execute(
          'SELECT role FROM users WHERE id = ?',
          [deleteId]
        );
        
        if (adminCheck.length > 0 && adminCheck[0].role === 'admin') {
          return {
            statusCode: 403,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Impossible de supprimer un administrateur' })
          };
        }
        
        await connection.execute('DELETE FROM users WHERE id = ?', [deleteId]);
        console.log('✅ Employé supprimé:', deleteId);
        result = { success: true, id: deleteId };
        break;

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Méthode non autorisée' })
        };
    }

    await connection.end();

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('❌ Erreur dans la fonction employees:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de la gestion des employés',
        details: error.message 
      })
    };
  }
};
