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
    console.log('🔍 Fonction notifications appelée:', event.httpMethod);
    
    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    let result;

    switch (event.httpMethod) {
      case 'GET':
        // Récupérer les notifications pour un utilisateur spécifique
        const userId = event.queryStringParameters?.userId;
        
        if (!userId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'userId requis' })
          };
        }

        const [rows] = await connection.execute(`
          SELECT 
            id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at
          FROM notifications 
          WHERE user_id = ? OR user_id = 0
          ORDER BY created_at DESC
          LIMIT 100
        `, [userId]);
        
        console.log(`✅ ${rows.length} notifications récupérées pour l'utilisateur ${userId}`);
        result = rows;
        break;

      case 'POST':
        // Créer une nouvelle notification
        const newNotification = JSON.parse(event.body);
        const [insertResult] = await connection.execute(`
          INSERT INTO notifications (
            user_id, title, message, type, is_read
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          newNotification.user_id,
          newNotification.title,
          newNotification.message,
          newNotification.type || 'info',
          newNotification.is_read || false
        ]);
        
        console.log('✅ Nouvelle notification créée:', insertResult.insertId);
        result = { id: insertResult.insertId, ...newNotification };
        break;

      case 'PUT':
        // Marquer une notification comme lue
        const notificationId = event.path.split('/').pop();
        const updateData = JSON.parse(event.body);
        
        if (updateData.is_read !== undefined) {
          await connection.execute(`
            UPDATE notifications 
            SET is_read = ?, created_at = created_at
            WHERE id = ?
          `, [updateData.is_read, notificationId]);
          
          console.log('✅ Notification mise à jour:', notificationId);
          result = { id: notificationId, is_read: updateData.is_read };
        } else {
          result = { error: 'Aucune donnée à mettre à jour' };
        }
        break;

      case 'DELETE':
        // Supprimer une notification
        const deleteId = event.path.split('/').pop();
        
        await connection.execute('DELETE FROM notifications WHERE id = ?', [deleteId]);
        console.log('✅ Notification supprimée:', deleteId);
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
    console.error('❌ Erreur dans la fonction notifications:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de la gestion des notifications',
        details: error.message 
      })
    };
  }
};
