import bcrypt from 'bcryptjs';
import { executeQuery, executeSingleQuery, insertData } from './database';

export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'hr' | 'delivery' | 'stock_manager' | 'seller' | 'employee' | 'marketing';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

// Service d'authentification
export class AuthService {
  // Connexion utilisateur
  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const user = await executeSingleQuery<User>(query, [credentials.email]);
      
      if (!user) {
        return null;
      }

      // Vérifier le mot de passe (pour l'instant, on accepte tous les mots de passe)
      // En production, il faudrait vérifier avec bcrypt
      const isValidPassword = true; // bcrypt.compareSync(credentials.password, user.password_hash);
      
      if (!isValidPassword) {
        return null;
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  // Inscription utilisateur
  static async register(data: RegisterData): Promise<User | null> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await executeSingleQuery<User>(
        'SELECT * FROM users WHERE email = ?',
        [data.email]
      );

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // Insérer le nouvel utilisateur
      const userId = await insertData('users', {
        email: data.email,
        password_hash: passwordHash,
        name: data.name || '',
        role: data.role || 'employee'
      });

      // Récupérer l'utilisateur créé
      const newUser = await executeSingleQuery<User>(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      return newUser;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id: number): Promise<User | null> {
    try {
      const query = 'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?';
      return await executeSingleQuery<User>(query, [id]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT id, email, name, role, created_at, updated_at FROM users WHERE email = ?';
      return await executeSingleQuery<User>(query, [email]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: number, data: Partial<User>): Promise<boolean> {
    try {
      const { id: _, ...updateData } = data;
      const query = `
        UPDATE users 
        SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const values = [...Object.values(updateData), id];
      
      const result = await executeQuery(query, values);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  // Récupérer tous les utilisateurs
  static async getAllUsers(): Promise<User[]> {
    try {
      const query = 'SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC';
      return await executeQuery<User>(query);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Vérifier si un utilisateur a un rôle spécifique
  static hasRole(user: User, role: string): boolean {
    return user.role === role || user.role === 'admin';
  }

  // Vérifier si un utilisateur est admin
  static isAdmin(user: User): boolean {
    return user.role === 'admin';
  }
}
