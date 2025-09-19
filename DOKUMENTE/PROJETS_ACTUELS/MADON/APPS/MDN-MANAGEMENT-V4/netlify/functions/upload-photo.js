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
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
    console.log('🔍 Fonction upload-photo appelée:', event.httpMethod);
    
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Méthode non autorisée' })
      };
    }

    const { user_id, photo_data, photo_type = 'profile' } = JSON.parse(event.body);
    
    if (!user_id || !photo_data) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'user_id et photo_data requis' })
      };
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à la base de données établie');

    // Vérifier que l'utilisateur existe
    const [userCheck] = await connection.execute(
      'SELECT id, first_name, last_name FROM users WHERE id = ?',
      [user_id]
    );
    
    if (userCheck.length === 0) {
      await connection.end();
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Utilisateur non trouvé' })
      };
    }

    // Mettre à jour la photo de profil de l'utilisateur
    const [updateResult] = await connection.execute(`
      UPDATE users 
      SET photo_url = ?, updated_at = NOW()
      WHERE id = ?
    `, [photo_data, user_id]);

    if (updateResult.affectedRows === 0) {
      await connection.end();
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Erreur lors de la mise à jour de la photo' })
      };
    }

    // Créer une notification pour l'utilisateur
    await connection.execute(`
      INSERT INTO notifications (user_id, title, message, type, is_read)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user_id,
      'Photo de profil mise à jour',
      'Votre photo de profil a été mise à jour avec succès',
      'success',
      false
    ]);

    await connection.end();

    console.log('✅ Photo de profil mise à jour pour l\'utilisateur:', user_id);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Photo de profil mise à jour avec succès',
        photo_url: photo_data
      })
    };

  } catch (error) {
    console.error('❌ Erreur dans la fonction upload-photo:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erreur lors de l\'upload de la photo',
        details: error.message 
      })
    };
  }
};
