// Système de données simulées pour le développement
// Utilisé quand la base de données n'est pas accessible

export interface MockUser {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'hr' | 'delivery' | 'stock_manager' | 'seller' | 'employee' | 'marketing';
  created_at: string;
  updated_at: string;
}

export interface MockEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: string;
  hire_date: string;
  photo_url?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface MockModule {
  id: number;
  name: string;
  path: string;
  icon: string;
  enabled: boolean;
  order_index: number;
  description?: string;
  created_at: string;
}

export interface MockProject {
  id: number;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  budget?: number;
  actual_cost?: number;
  progress: number;
  created_by: number;
  project_manager?: number;
  created_at: string;
  updated_at: string;
}

export interface MockTask {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  created_by: number;
  project_id?: number;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface MockAbsence {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  type: 'vacation' | 'sick_leave' | 'personal_leave' | 'maternity_leave' | 'paternity_leave' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  total_days?: number;
  reason?: string;
  affects_salary: boolean;
  affects_deliveries: boolean;
  affects_sales: boolean;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface MockSale {
  id: number;
  date: string;
  seller_id: number;
  client_name: string;
  client_email?: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface MockDelivery {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  delivery_address: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  delivery_date?: string;
  estimated_delivery?: string;
  driver_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MockProduct {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  category: string;
  supplier?: string;
  stock_quantity: number;
  min_stock_level: number;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
}

// Données simulées
const mockUsers: MockUser[] = [
  {
    id: 1,
    email: 'admin@madon.com',
    name: 'Administrateur Principal',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'hr@madon.com',
    name: 'Manager RH',
    role: 'hr',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    email: 'delivery@madon.com',
    name: 'Responsable Livraisons',
    role: 'delivery',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    email: 'stock@madon.com',
    name: 'Gestionnaire Stock',
    role: 'stock_manager',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    email: 'sales@madon.com',
    name: 'Directeur Commercial',
    role: 'seller',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    email: 'marketing@madon.com',
    name: 'Responsable Marketing',
    role: 'marketing',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockEmployees: MockEmployee[] = [
  {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@madon.com',
    phone: '+33123456789',
    department: 'RH',
    position: 'Manager RH',
    role: 'hr',
    status: 'active',
    salary: '4500.00',
    hire_date: '2023-01-15',
    address: '123 Rue de la Paix, Paris',
    emergency_contact: 'Marie Dupont',
    emergency_phone: '+33123456790',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 2,
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie.martin@madon.com',
    phone: '+33123456791',
    department: 'Livraison',
    position: 'Livreur Senior',
    role: 'delivery',
    status: 'active',
    salary: '2800.00',
    hire_date: '2023-02-20',
    address: '456 Avenue des Champs, Lyon',
    emergency_contact: 'Pierre Martin',
    emergency_phone: '+33123456792',
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2023-02-20T00:00:00Z'
  },
  {
    id: 3,
    first_name: 'Pierre',
    last_name: 'Durand',
    email: 'pierre.durand@madon.com',
    phone: '+33123456793',
    department: 'Ventes',
    position: 'Commercial Senior',
    role: 'seller',
    status: 'active',
    salary: '3200.00',
    hire_date: '2023-03-10',
    address: '789 Boulevard Central, Marseille',
    emergency_contact: 'Sophie Durand',
    emergency_phone: '+33123456794',
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z'
  },
  {
    id: 4,
    first_name: 'Sophie',
    last_name: 'Leroy',
    email: 'sophie.leroy@madon.com',
    phone: '+33123456795',
    department: 'Marketing',
    position: 'Responsable Marketing',
    role: 'marketing',
    status: 'active',
    salary: '3800.00',
    hire_date: '2023-04-05',
    address: '321 Rue du Commerce, Toulouse',
    emergency_contact: 'Thomas Leroy',
    emergency_phone: '+33123456796',
    created_at: '2023-04-05T00:00:00Z',
    updated_at: '2023-04-05T00:00:00Z'
  },
  {
    id: 5,
    first_name: 'Thomas',
    last_name: 'Moreau',
    email: 'thomas.moreau@madon.com',
    phone: '+33123456797',
    department: 'Stock',
    position: 'Gestionnaire Stock',
    role: 'stock_manager',
    status: 'active',
    salary: '2600.00',
    hire_date: '2023-05-12',
    address: '654 Avenue de l\'Industrie, Nantes',
    emergency_contact: 'Julie Moreau',
    emergency_phone: '+33123456798',
    created_at: '2023-05-12T00:00:00Z',
    updated_at: '2023-05-12T00:00:00Z'
  },
  {
    id: 6,
    first_name: 'Julie',
    last_name: 'Petit',
    email: 'julie.petit@madon.com',
    phone: '+33123456799',
    department: 'Livraison',
    position: 'Livreur',
    role: 'delivery',
    status: 'active',
    salary: '2400.00',
    hire_date: '2023-06-18',
    address: '987 Rue des Fleurs, Bordeaux',
    emergency_contact: 'Marc Petit',
    emergency_phone: '+33123456800',
    created_at: '2023-06-18T00:00:00Z',
    updated_at: '2023-06-18T00:00:00Z'
  },
  {
    id: 7,
    first_name: 'Marc',
    last_name: 'Roux',
    email: 'marc.roux@madon.com',
    phone: '+33123456801',
    department: 'Ventes',
    position: 'Commercial',
    role: 'seller',
    status: 'active',
    salary: '2900.00',
    hire_date: '2023-07-22',
    address: '147 Boulevard de la République, Nice',
    emergency_contact: 'Anne Roux',
    emergency_phone: '+33123456802',
    created_at: '2023-07-22T00:00:00Z',
    updated_at: '2023-07-22T00:00:00Z'
  },
  {
    id: 8,
    first_name: 'Anne',
    last_name: 'Simon',
    email: 'anne.simon@madon.com',
    phone: '+33123456803',
    department: 'RH',
    position: 'Assistant RH',
    role: 'hr',
    status: 'active',
    salary: '2200.00',
    hire_date: '2023-08-30',
    address: '258 Rue de la Liberté, Strasbourg',
    emergency_contact: 'Paul Simon',
    emergency_phone: '+33123456804',
    created_at: '2023-08-30T00:00:00Z',
    updated_at: '2023-08-30T00:00:00Z'
  }
];

const mockModules: MockModule[] = [
  {
    id: 1,
    name: 'Tableau de bord',
    path: '/',
    icon: 'LayoutDashboard',
    enabled: true,
    order_index: 1,
    description: 'Vue d\'ensemble de l\'entreprise',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Employés',
    path: '/employees',
    icon: 'Users',
    enabled: true,
    order_index: 2,
    description: 'Gestion des employés et RH',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Livraisons',
    path: '/deliveries',
    icon: 'Truck',
    enabled: true,
    order_index: 3,
    description: 'Suivi des livraisons',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Stock',
    path: '/stocks',
    icon: 'Package',
    enabled: true,
    order_index: 4,
    description: 'Gestion des stocks et produits',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Ventes',
    path: '/sales',
    icon: 'Store',
    enabled: true,
    order_index: 5,
    description: 'Suivi des ventes et commissions',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Tâches',
    path: '/tasks',
    icon: 'ClipboardList',
    enabled: true,
    order_index: 6,
    description: 'Gestion des projets et tâches',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    name: 'Marketing',
    path: '/marketing',
    icon: 'Share2',
    enabled: true,
    order_index: 7,
    description: 'Campagnes marketing et réseaux sociaux',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    name: 'Finances',
    path: '/finance',
    icon: 'DollarSign',
    enabled: true,
    order_index: 8,
    description: 'Comptabilité et rapports financiers',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockProjects: MockProject[] = [
  {
    id: 1,
    name: 'Refonte Site Web',
    description: 'Modernisation du site web corporate',
    status: 'active',
    priority: 'high',
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    budget: 50000,
    actual_cost: 25000,
    progress: 50,
    created_by: 1,
    project_manager: 1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Lancement Produit X',
    description: 'Lancement du nouveau produit phare',
    status: 'planning',
    priority: 'urgent',
    start_date: '2024-03-01',
    end_date: '2024-08-31',
    budget: 75000,
    actual_cost: 0,
    progress: 0,
    created_by: 1,
    project_manager: 4,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Optimisation Logistique',
    description: 'Amélioration des processus de livraison',
    status: 'active',
    priority: 'medium',
    start_date: '2024-02-01',
    end_date: '2024-05-31',
    budget: 30000,
    actual_cost: 15000,
    progress: 60,
    created_by: 1,
    project_manager: 2,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  }
];

const mockTasks: MockTask[] = [
  {
    id: 1,
    title: 'Design Interface',
    description: 'Créer les maquettes de l\'interface',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 4,
    created_by: 1,
    project_id: 1,
    due_date: '2024-04-15',
    estimated_hours: 40,
    actual_hours: 25,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    title: 'Développement Frontend',
    description: 'Développer l\'interface utilisateur',
    status: 'todo',
    priority: 'high',
    assigned_to: 4,
    created_by: 1,
    project_id: 1,
    due_date: '2024-05-15',
    estimated_hours: 80,
    actual_hours: 0,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    title: 'Étude de Marché',
    description: 'Analyser la concurrence',
    status: 'done',
    priority: 'high',
    assigned_to: 4,
    created_by: 1,
    project_id: 2,
    due_date: '2024-03-15',
    estimated_hours: 30,
    actual_hours: 28,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  },
  {
    id: 4,
    title: 'Optimisation Routes',
    description: 'Optimiser les routes de livraison',
    status: 'in_progress',
    priority: 'medium',
    assigned_to: 2,
    created_by: 1,
    project_id: 3,
    due_date: '2024-04-30',
    estimated_hours: 35,
    actual_hours: 20,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  }
];

const mockAbsences: MockAbsence[] = [
  {
    id: 1,
    employee_id: 2,
    start_date: '2024-04-15',
    end_date: '2024-04-19',
    type: 'vacation',
    status: 'approved',
    total_days: 5,
    reason: 'Congés de printemps',
    affects_salary: false,
    affects_deliveries: true,
    affects_sales: false,
    approved_by: 1,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z'
  },
  {
    id: 2,
    employee_id: 3,
    start_date: '2024-05-20',
    end_date: '2024-05-22',
    type: 'personal_leave',
    status: 'pending',
    total_days: 3,
    reason: 'Rendez-vous personnel',
    affects_salary: false,
    affects_deliveries: false,
    affects_sales: true,
    created_at: '2024-04-20T00:00:00Z',
    updated_at: '2024-04-20T00:00:00Z'
  },
  {
    id: 3,
    employee_id: 5,
    start_date: '2024-06-10',
    end_date: '2024-06-14',
    type: 'vacation',
    status: 'approved',
    total_days: 5,
    reason: 'Vacances d\'été',
    affects_salary: false,
    affects_deliveries: false,
    affects_sales: false,
    approved_by: 1,
    created_at: '2024-05-10T00:00:00Z',
    updated_at: '2024-05-10T00:00:00Z'
  }
];

const mockSales: MockSale[] = [
  {
    id: 1,
    date: '2024-01-15',
    seller_id: 3,
    client_name: 'Entreprise ABC',
    client_email: 'contact@abc.com',
    amount: 2500,
    commission: 125,
    status: 'completed',
    notes: 'Vente réussie',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    date: '2024-01-20',
    seller_id: 7,
    client_name: 'Société XYZ',
    client_email: 'info@xyz.com',
    amount: 1800,
    commission: 81,
    status: 'completed',
    notes: 'Client satisfait',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 3,
    date: '2024-02-05',
    seller_id: 3,
    client_name: 'Startup Innov',
    client_email: 'hello@innov.com',
    amount: 3200,
    commission: 160,
    status: 'completed',
    notes: 'Nouveau client',
    created_at: '2024-02-05T00:00:00Z'
  },
  {
    id: 4,
    date: '2024-02-12',
    seller_id: 7,
    client_name: 'Corporation DEF',
    client_email: 'sales@def.com',
    amount: 4500,
    commission: 270,
    status: 'completed',
    notes: 'Gros contrat',
    created_at: '2024-02-12T00:00:00Z'
  }
];

const mockDeliveries: MockDelivery[] = [
  {
    id: 1,
    tracking_number: 'TRK001',
    customer_name: 'Jean Martin',
    customer_email: 'jean.martin@email.com',
    customer_phone: '+33123456810',
    delivery_address: '123 Rue de la Paix, Paris',
    status: 'delivered',
    delivery_date: '2024-01-20',
    estimated_delivery: '2024-01-20',
    driver_id: 2,
    notes: 'Livraison réussie',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 2,
    tracking_number: 'TRK002',
    customer_name: 'Marie Dubois',
    customer_email: 'marie.dubois@email.com',
    customer_phone: '+33123456811',
    delivery_address: '456 Avenue des Champs, Lyon',
    status: 'delivered',
    delivery_date: '2024-01-22',
    estimated_delivery: '2024-01-22',
    driver_id: 2,
    notes: 'Client satisfait',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  },
  {
    id: 3,
    tracking_number: 'TRK003',
    customer_name: 'Pierre Leroy',
    customer_email: 'pierre.leroy@email.com',
    customer_phone: '+33123456812',
    delivery_address: '789 Boulevard Central, Marseille',
    status: 'in_transit',
    estimated_delivery: '2024-01-25',
    driver_id: 6,
    notes: 'En cours de livraison',
    created_at: '2024-01-23T00:00:00Z',
    updated_at: '2024-01-23T00:00:00Z'
  },
  {
    id: 4,
    tracking_number: 'TRK004',
    customer_name: 'Sophie Moreau',
    customer_email: 'sophie.moreau@email.com',
    customer_phone: '+33123456813',
    delivery_address: '321 Rue du Commerce, Toulouse',
    status: 'pending',
    estimated_delivery: '2024-01-26',
    driver_id: 6,
    notes: 'En attente de préparation',
    created_at: '2024-01-24T00:00:00Z',
    updated_at: '2024-01-24T00:00:00Z'
  }
];

const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: 'Ordinateur Portable Pro',
    description: 'Ordinateur portable professionnel 15"',
    sku: 'LAPTOP-001',
    price: 899.99,
    cost: 650.00,
    category: 'Informatique',
    supplier: 'TechSupplier',
    stock_quantity: 25,
    min_stock_level: 5,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Smartphone Business',
    description: 'Smartphone pour professionnels',
    sku: 'PHONE-001',
    price: 599.99,
    cost: 450.00,
    category: 'Téléphonie',
    supplier: 'MobileCorp',
    stock_quantity: 40,
    min_stock_level: 10,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Tablette Tactile',
    description: 'Tablette 10" pour présentations',
    sku: 'TABLET-001',
    price: 299.99,
    cost: 220.00,
    category: 'Informatique',
    supplier: 'TechSupplier',
    stock_quantity: 30,
    min_stock_level: 8,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Imprimante Laser',
    description: 'Imprimante laser monochrome',
    sku: 'PRINTER-001',
    price: 199.99,
    cost: 150.00,
    category: 'Bureautique',
    supplier: 'OfficeSupply',
    stock_quantity: 15,
    min_stock_level: 3,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Écran 24"',
    description: 'Écran LED 24 pouces',
    sku: 'MONITOR-001',
    price: 149.99,
    cost: 110.00,
    category: 'Informatique',
    supplier: 'TechSupplier',
    stock_quantity: 20,
    min_stock_level: 5,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Service de base de données simulée
export class MockDatabaseService {
  // Authentification
  static async login(email: string, password: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }

  // Modules
  static async getModules(): Promise<MockModule[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockModules.filter(m => m.enabled);
  }

  // Employés
  static async getEmployees(): Promise<MockEmployee[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockEmployees;
  }

  static async getEmployeeById(id: number): Promise<MockEmployee | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEmployees.find(e => e.id === id) || null;
  }

  static async createEmployee(data: Omit<MockEmployee, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newId = Math.max(...mockEmployees.map(e => e.id)) + 1;
    const now = new Date().toISOString();
    
    const newEmployee: MockEmployee = {
      ...data,
      id: newId,
      created_at: now,
      updated_at: now
    };
    
    mockEmployees.push(newEmployee);
    return newId;
  }

  static async updateEmployee(id: number, data: Partial<MockEmployee>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEmployees.findIndex(e => e.id === id);
    
    if (index !== -1) {
      mockEmployees[index] = {
        ...mockEmployees[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  static async deleteEmployee(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockEmployees.findIndex(e => e.id === id);
    
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      return true;
    }
    return false;
  }

  // Projets
  static async getProjects(): Promise<MockProject[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProjects;
  }

  static async getProjectById(id: number): Promise<MockProject | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProjects.find(p => p.id === id) || null;
  }

  // Tâches
  static async getTasks(): Promise<MockTask[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTasks;
  }

  static async getTasksByProject(projectId: number): Promise<MockTask[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTasks.filter(t => t.project_id === projectId);
  }

  // Absences
  static async getAbsences(): Promise<MockAbsence[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockAbsences;
  }

  static async getAbsencesByEmployee(employeeId: number): Promise<MockAbsence[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAbsences.filter(a => a.employee_id === employeeId);
  }

  // Ventes
  static async getSales(): Promise<MockSale[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSales;
  }

  static async getSalesBySeller(sellerId: number): Promise<MockSale[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSales.filter(s => s.seller_id === sellerId);
  }

  // Livraisons
  static async getDeliveries(): Promise<MockDelivery[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockDeliveries;
  }

  static async getDeliveriesByDriver(driverId: number): Promise<MockDelivery[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDeliveries.filter(d => d.driver_id === driverId);
  }

  // Produits
  static async getProducts(): Promise<MockProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts;
  }

  static async getProductById(id: number): Promise<MockProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.find(p => p.id === id) || null;
  }

  // Recherche
  static async searchEmployees(query: string): Promise<MockEmployee[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    
    return mockEmployees.filter(employee => 
      employee.first_name.toLowerCase().includes(lowerQuery) ||
      employee.last_name.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery) ||
      employee.department.toLowerCase().includes(lowerQuery) ||
      employee.position.toLowerCase().includes(lowerQuery)
    );
  }
}
