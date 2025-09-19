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
    console.log('🔍 Fonction leave-requests appelée:', event.httpMethod);
    
    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    let result;

    switch (event.httpMethod) {
      case 'GET':
        // Récupérer toutes les demandes de congés avec les informations des employés
        const [rows] = await connection.execute(`
          SELECT 
            lr.id,
            lr.employee_id,
            lr.start_date,
            lr.end_date,
            lr.type,
            lr.reason,
            lr.status,
            lr.approved_by,
            lr.created_at,
            lr.updated_at,
            u.first_name,
            u.last_name,
            u.email,
            u.department,
            u.position,
            approver.first_name as approved_by_name,
            approver.last_name as approved_by_lastname
          FROM leave_requests lr
          LEFT JOIN users u ON lr.employee_id = u.id
          LEFT JOIN users approver ON lr.approved_by = approver.id
          ORDER BY lr.created_at DESC
        `);
        
        console.log(`✅ ${rows.length} demandes de congés récupérées`);
        result = rows;
        break;

      case 'POST':
        // Créer une nouvelle demande de congé
        const newRequest = JSON.parse(event.body);
        const { employee_id, start_date, end_date, type, reason, status, created_by_admin } = newRequest;
        
        // Vérifier que l'employé existe
        const [employeeCheck] = await connection.execute(
          'SELECT id, first_name, last_name, role FROM users WHERE id = ?',
          [employee_id]
        );
        
        if (employeeCheck.length === 0) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Employé non trouvé' })
          };
        }
        
        const [insertResult] = await connection.execute(`
          INSERT INTO leave_requests (
            employee_id, start_date, end_date, type, reason, status
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          employee_id,
          start_date,
          end_date,
          type,
          reason,
          status || 'pending'
        ]);
        
        // Créer une notification pour l'employé concerné
        const notificationMessage = created_by_admin 
          ? `Une demande de congé a été créée pour vous par un administrateur (${type} du ${start_date} au ${end_date})`
          : `Votre demande de congé a été créée avec succès (${type} du ${start_date} au ${end_date})`;
          
        await connection.execute(`
          INSERT INTO notifications (user_id, title, message, type, is_read)
          VALUES (?, ?, ?, ?, ?)
        `, [
          employee_id,
          created_by_admin ? 'Demande de congé créée par un admin' : 'Demande de congé créée',
          notificationMessage,
          'info',
          false
        ]);
        
        console.log('✅ Nouvelle demande de congé créée:', insertResult.insertId);
        result = { id: insertResult.insertId, ...newRequest };
        break;

      case 'PUT':
        // Mettre à jour une demande de congé (approbation/rejet)
        const requestId = event.path.split('/').pop();
        const updateData = JSON.parse(event.body);
        
        // Récupérer les informations de la demande avant mise à jour
        const [currentRequest] = await connection.execute(`
          SELECT lr.*, u.first_name, u.last_name 
          FROM leave_requests lr 
          LEFT JOIN users u ON lr.employee_id = u.id 
          WHERE lr.id = ?
        `, [requestId]);
        
        if (currentRequest.length === 0) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Demande de congé non trouvée' })
          };
        }
        
        const updateFields = [];
        const updateValues = [];
        
        Object.keys(updateData).forEach(key => {
          if (key !== 'id' && key !== 'created_at') {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        });
        
        if (updateFields.length > 0) {
          updateValues.push(requestId);
          await connection.execute(`
            UPDATE leave_requests 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE id = ?
          `, updateValues);
          
          // Créer une notification si le statut change
          if (updateData.status && updateData.status !== currentRequest[0].status) {
            const statusMessages = {
              'approved': 'Votre demande de congé a été approuvée',
              'rejected': 'Votre demande de congé a été rejetée',
              'pending': 'Votre demande de congé est en attente'
            };
            
            const notificationMessage = statusMessages[updateData.status] || 
              `Le statut de votre demande de congé a été modifié: ${updateData.status}`;
              
            await connection.execute(`
              INSERT INTO notifications (user_id, title, message, type, is_read)
              VALUES (?, ?, ?, ?, ?)
            `, [
              currentRequest[0].employee_id,
              'Statut de demande de congé modifié',
              notificationMessage,
              updateData.status === 'approved' ? 'success' : 
              updateData.status === 'rejected' ? 'error' : 'info',
              false
            ]);
          }
          
          console.log('✅ Demande de congé mise à jour:', requestId);
          result = { id: requestId, ...updateData };
        } else {
          result = { error: 'Aucune donnée à mettre à jour' };
        }
        break;

      case 'DELETE':
        // Supprimer une demande de congé
        const deleteId = event.path.split('/').pop();
        
        await connection.execute('DELETE FROM leave_requests WHERE id = ?', [deleteId]);
        console.log('✅ Demande de congé supprimée:', deleteId);
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
    console.error('❌ Erreur dans la fonction leave-requests:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de la gestion des demandes de congés',
        details: error.message 
      })
    };
  }
};
