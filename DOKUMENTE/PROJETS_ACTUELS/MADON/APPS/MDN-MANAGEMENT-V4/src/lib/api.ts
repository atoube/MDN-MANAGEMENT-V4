// Service API pour communiquer avec le serveur backend
// Avec fallback vers les données simulées

import { MockDatabaseService } from './mock-database';

const API_BASE_URL = 'http://localhost:3001/api';
const USE_MOCK_DATA = true; // Forcer l'utilisation des données simulées pour le développement

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Erreur serveur' };
      }

      return { data };
    } catch (error) {
      console.error('Erreur API:', error);
      return { error: 'Erreur de connexion au serveur' };
    }
  }

  // Authentification
  async login(email: string, password: string) {
    if (USE_MOCK_DATA) {
      const user = await MockDatabaseService.login(email, password);
      if (user) {
        return { data: user };
      } else {
        return { error: 'Email ou mot de passe incorrect' };
      }
    }

    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string, role?: string) {
    if (USE_MOCK_DATA) {
      const user = {
        id: Math.floor(Math.random() * 1000) + 1,
        email,
        name: name || '',
        role: (role as any) || 'employee',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: user };
    }

    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  // Modules
  async getModules() {
    if (USE_MOCK_DATA) {
      const modules = await MockDatabaseService.getModules();
      return { data: modules };
    }

    return this.request('/modules');
  }

  // Employés
  async getEmployees() {
    if (USE_MOCK_DATA) {
      const employees = await MockDatabaseService.getEmployees();
      return { data: employees };
    }

    return this.request('/employees');
  }

  async getEmployee(id: number) {
    if (USE_MOCK_DATA) {
      const employee = await MockDatabaseService.getEmployeeById(id);
      if (employee) {
        return { data: employee };
      } else {
        return { error: 'Employé non trouvé' };
      }
    }

    return this.request(`/employees/${id}`);
  }

  async createEmployee(employeeData: any) {
    if (USE_MOCK_DATA) {
      const newId = await MockDatabaseService.createEmployee(employeeData);
      return { data: { id: newId, ...employeeData } };
    }

    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: number, employeeData: any) {
    if (USE_MOCK_DATA) {
      const success = await MockDatabaseService.updateEmployee(id, employeeData);
      if (success) {
        return { data: { success: true } };
      } else {
        return { error: 'Employé non trouvé' };
      }
    }

    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: number) {
    if (USE_MOCK_DATA) {
      const success = await MockDatabaseService.deleteEmployee(id);
      if (success) {
        return { data: { success: true } };
      } else {
        return { error: 'Employé non trouvé' };
      }
    }

    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Projets
  async getProjects() {
    if (USE_MOCK_DATA) {
      const projects = await MockDatabaseService.getProjects();
      return { data: projects };
    }

    return this.request('/projects');
  }

  async getProject(id: number) {
    if (USE_MOCK_DATA) {
      const project = await MockDatabaseService.getProjectById(id);
      if (project) {
        return { data: project };
      } else {
        return { error: 'Projet non trouvé' };
      }
    }

    return this.request(`/projects/${id}`);
  }

  // Tâches
  async getTasks() {
    if (USE_MOCK_DATA) {
      const tasks = await MockDatabaseService.getTasks();
      return { data: tasks };
    }

    return this.request('/tasks');
  }

  async getTasksByProject(projectId: number) {
    if (USE_MOCK_DATA) {
      const tasks = await MockDatabaseService.getTasksByProject(projectId);
      return { data: tasks };
    }

    return this.request(`/projects/${projectId}/tasks`);
  }

  // Absences
  async getAbsences() {
    if (USE_MOCK_DATA) {
      const absences = await MockDatabaseService.getAbsences();
      return { data: absences };
    }

    return this.request('/absences');
  }

  async getAbsencesByEmployee(employeeId: number) {
    if (USE_MOCK_DATA) {
      const absences = await MockDatabaseService.getAbsencesByEmployee(employeeId);
      return { data: absences };
    }

    return this.request(`/employees/${employeeId}/absences`);
  }

  // Ventes
  async getSales() {
    if (USE_MOCK_DATA) {
      const sales = await MockDatabaseService.getSales();
      return { data: sales };
    }

    return this.request('/sales');
  }

  async getSalesBySeller(sellerId: number) {
    if (USE_MOCK_DATA) {
      const sales = await MockDatabaseService.getSalesBySeller(sellerId);
      return { data: sales };
    }

    return this.request(`/sellers/${sellerId}/sales`);
  }

  // Livraisons
  async getDeliveries() {
    if (USE_MOCK_DATA) {
      const deliveries = await MockDatabaseService.getDeliveries();
      return { data: deliveries };
    }

    return this.request('/deliveries');
  }

  async getDeliveriesByDriver(driverId: number) {
    if (USE_MOCK_DATA) {
      const deliveries = await MockDatabaseService.getDeliveriesByDriver(driverId);
      return { data: deliveries };
    }

    return this.request(`/employees/${driverId}/deliveries`);
  }

  // Produits
  async getProducts() {
    if (USE_MOCK_DATA) {
      const products = await MockDatabaseService.getProducts();
      return { data: products };
    }

    return this.request('/products');
  }

  async getProduct(id: number) {
    if (USE_MOCK_DATA) {
      const product = await MockDatabaseService.getProductById(id);
      if (product) {
        return { data: product };
      } else {
        return { error: 'Produit non trouvé' };
      }
    }

    return this.request(`/products/${id}`);
  }

  // Santé du serveur
  async healthCheck() {
    if (USE_MOCK_DATA) {
      return { data: { status: 'OK', message: 'Mode développement avec données simulées' } };
    }

    return this.request('/health');
  }
}

export const apiService = new ApiService();