import mysql from 'mysql2/promise';

// Configuration de la base de données locale pour le développement
export const localDbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Mot de passe vide par défaut pour MySQL local
  database: 'MDN_SUITE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Configuration de la base de données de production
export const productionDbConfig = {
  host: 'db5017958553.hosting-data.io',
  port: 3306,
  user: 'dbu1050870',
  password: 'mdn_suite_001',
  database: 'MDN_SUITE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Choisir la configuration selon l'environnement
const isDevelopment = process.env.NODE_ENV === 'development';
export const dbConfig = isDevelopment ? localDbConfig : productionDbConfig;

// Pool de connexions
let pool: mysql.Pool | null = null;

export const getConnection = async (): Promise<mysql.Pool> => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // Test de connexion
    try {
      const connection = await pool.getConnection();
      console.log('✅ Connexion à la base de données MariaDB réussie');
      connection.release();
    } catch (error) {
      console.error('❌ Erreur de connexion à la base de données:', error);
      throw error;
    }
  }
  
  return pool;
};

// Fonction pour exécuter des requêtes
export const executeQuery = async <T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
};

// Fonction pour exécuter une seule requête
export const executeSingleQuery = async <T = any>(
  query: string, 
  params: any[] = []
): Promise<T | null> => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(query, params);
    const results = rows as T[];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
};

// Fonction pour insérer des données
export const insertData = async (
  table: string, 
  data: Record<string, any>
): Promise<number> => {
  try {
    const connection = await getConnection();
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');
    
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await connection.execute(query, values);
    
    return (result as any).insertId;
  } catch (error) {
    console.error('Erreur lors de l\'insertion:', error);
    throw error;
  }
};

// Fonction pour mettre à jour des données
export const updateData = async (
  table: string, 
  data: Record<string, any>, 
  where: Record<string, any>
): Promise<number> => {
  try {
    const connection = await getConnection();
    const setColumns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const whereColumns = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    
    const query = `UPDATE ${table} SET ${setColumns} WHERE ${whereColumns}`;
    const values = [...Object.values(data), ...Object.values(where)];
    
    const [result] = await connection.execute(query, values);
    return (result as any).affectedRows;
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
};

// Fonction pour supprimer des données
export const deleteData = async (
  table: string, 
  where: Record<string, any>
): Promise<number> => {
  try {
    const connection = await getConnection();
    const whereColumns = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    
    const query = `DELETE FROM ${table} WHERE ${whereColumns}`;
    const values = Object.values(where);
    
    const [result] = await connection.execute(query, values);
    return (result as any).affectedRows;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

// Fermer la connexion
export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
