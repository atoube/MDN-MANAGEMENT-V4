import React, { useEffect } from 'react';

export const EmployeesInitializer: React.FC = () => {
  useEffect(() => {
    // Vérifier si des données existent déjà
    const existingEmployees = localStorage.getItem('employees');
    if (existingEmployees) {
      console.log('📂 Données d\'employés existantes trouvées, pas d\'initialisation');
      return;
    }
    
    // Vérifier si l'initialisation a déjà été faite
    const isInitialized = localStorage.getItem('employees-initialized');
    if (isInitialized) {
      console.log('📂 Employés déjà initialisés, pas de re-initialisation');
      return;
    }
    
    // Initialiser seulement si aucune donnée n'existe
    console.log('🔄 Initialisation des 14 employés conformes...');
    
    const initialEmployees = [
      // Administrateurs
      {
        id: 1,
        first_name: 'Ahmadou',
        last_name: 'Dipita',
        email: 'a.dipita@themadon.com',
        phone: '+237 6 88 77 66 55',
        department: 'Informatique',
        position: 'Administrateur Principal',
        role: 'admin',
        status: 'active',
        salary: '600000',
        hire_date: '2023-03-01',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Marie Dipita',
        emergency_phone: '+237 6 88 77 66 56',
        created_at: '2023-03-01T09:00:00Z',
        updated_at: '2024-03-01T14:30:00Z',
        password: 'Start01!',
        must_change_password: false
      },
      {
        id: 2,
        first_name: 'Admin',
        last_name: 'System',
        email: 'admin@madon.com',
        phone: '+237 6 88 77 66 57',
        department: 'Informatique',
        position: 'Administrateur Système',
        role: 'admin',
        status: 'active',
        salary: '580000',
        hire_date: '2024-01-01',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Admin Contact',
        emergency_phone: '+237 6 88 77 66 58',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T14:30:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // RH
      {
        id: 3,
        first_name: 'Fatou',
        last_name: 'Ndiaye',
        email: 'fatou.ndiaye@madon.cm',
        phone: '+237 6 95 23 45 67',
        department: 'Ressources Humaines',
        position: 'Chef RH',
        role: 'hr',
        status: 'active',
        salary: '550000',
        hire_date: '2021-08-20',
        address: 'Quartier Bastos, Yaoundé, Cameroun',
        emergency_contact: 'Mamadou Ndiaye',
        emergency_phone: '+237 6 96 34 56 78',
        created_at: '2021-08-20T09:00:00Z',
        updated_at: '2024-03-01T16:45:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      {
        id: 4,
        first_name: 'Manager',
        last_name: 'RH',
        email: 'hr@madon.com',
        phone: '+237 6 95 23 45 68',
        department: 'Ressources Humaines',
        position: 'Manager RH',
        role: 'hr',
        status: 'active',
        salary: '520000',
        hire_date: '2024-01-01',
        address: 'Quartier Bastos, Yaoundé, Cameroun',
        emergency_contact: 'RH Contact',
        emergency_phone: '+237 6 95 23 45 69',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T16:45:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Managers
      {
        id: 5,
        first_name: 'Kouassi',
        last_name: 'Mensah',
        email: 'kouassi.mensah@madon.cm',
        phone: '+237 6 96 34 56 78',
        department: 'Ventes',
        position: 'Manager Ventes',
        role: 'manager',
        status: 'active',
        salary: '480000',
        hire_date: '2023-01-10',
        address: 'Quartier Bonamoussadi, Douala, Cameroun',
        emergency_contact: 'Aissatou Mensah',
        emergency_phone: '+237 6 97 45 67 89',
        created_at: '2023-01-10T08:30:00Z',
        updated_at: '2024-03-01T12:15:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      {
        id: 6,
        first_name: 'Directeur',
        last_name: 'Commercial',
        email: 'sales@madon.com',
        phone: '+237 6 96 34 56 79',
        department: 'Ventes',
        position: 'Directeur Commercial',
        role: 'manager',
        status: 'active',
        salary: '500000',
        hire_date: '2024-01-01',
        address: 'Quartier Bonamoussadi, Douala, Cameroun',
        emergency_contact: 'Sales Contact',
        emergency_phone: '+237 6 96 34 56 80',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T12:15:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Employés - Livraison
      {
        id: 7,
        first_name: 'Aissatou',
        last_name: 'Diallo',
        email: 'aissatou.diallo@madon.cm',
        phone: '+237 6 97 45 67 89',
        department: 'Logistique',
        position: 'Responsable Livraison',
        role: 'employee',
        status: 'active',
        salary: '320000',
        hire_date: '2022-11-05',
        address: 'Quartier New Bell, Douala, Cameroun',
        emergency_contact: 'Moussa Diallo',
        emergency_phone: '+237 6 98 56 78 90',
        created_at: '2022-11-05T14:00:00Z',
        updated_at: '2024-03-01T11:20:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      {
        id: 8,
        first_name: 'Responsable',
        last_name: 'Livraisons',
        email: 'delivery@madon.com',
        phone: '+237 6 97 45 67 90',
        department: 'Logistique',
        position: 'Responsable Livraisons',
        role: 'employee',
        status: 'active',
        salary: '350000',
        hire_date: '2024-01-01',
        address: 'Quartier New Bell, Douala, Cameroun',
        emergency_contact: 'Delivery Contact',
        emergency_phone: '+237 6 97 45 67 91',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T11:20:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Employés - Stock
      {
        id: 9,
        first_name: 'Moussa',
        last_name: 'Traoré',
        email: 'moussa.traore@madon.cm',
        phone: '+237 6 98 56 78 90',
        department: 'Support',
        position: 'Technicien Support',
        role: 'employee',
        status: 'active',
        salary: '280000',
        hire_date: '2023-06-12',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Aminata Traoré',
        emergency_phone: '+237 6 99 67 89 01',
        created_at: '2023-06-12T11:00:00Z',
        updated_at: '2024-03-01T13:45:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      {
        id: 10,
        first_name: 'Gestionnaire',
        last_name: 'Stock',
        email: 'stock@madon.com',
        phone: '+237 6 98 56 78 91',
        department: 'Stock',
        position: 'Gestionnaire Stock',
        role: 'employee',
        status: 'active',
        salary: '300000',
        hire_date: '2024-01-01',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Stock Contact',
        emergency_phone: '+237 6 98 56 78 92',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T13:45:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Employés - Marketing
      {
        id: 11,
        first_name: 'Ahmadou',
        last_name: 'Bello',
        email: 'ahmadou.bello@madon.cm',
        phone: '+237 6 94 12 34 56',
        department: 'Informatique',
        position: 'Développeur Senior',
        role: 'employee',
        status: 'active',
        salary: '450000',
        hire_date: '2022-03-15',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Fatou Bello',
        emergency_phone: '+237 6 95 23 45 67',
        created_at: '2022-03-15T10:00:00Z',
        updated_at: '2024-03-01T14:30:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      {
        id: 12,
        first_name: 'Responsable',
        last_name: 'Marketing',
        email: 'marketing@madon.com',
        phone: '+237 6 94 12 34 57',
        department: 'Marketing',
        position: 'Responsable Marketing',
        role: 'employee',
        status: 'active',
        salary: '400000',
        hire_date: '2024-01-01',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Marketing Contact',
        emergency_phone: '+237 6 94 12 34 58',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-01T14:30:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Employés - Comptabilité
      {
        id: 13,
        first_name: 'Jean',
        last_name: 'Baptiste',
        email: 'jean.baptiste@madon.cm',
        phone: '+237 6 88 77 66 55',
        department: 'Comptabilité',
        position: 'Comptable',
        role: 'employee',
        status: 'inactive',
        salary: '350000',
        hire_date: '2022-05-10',
        address: 'Quartier New Bell, Douala, Cameroun',
        emergency_contact: 'Marie Baptiste',
        emergency_phone: '+237 6 88 77 66 56',
        created_at: '2022-05-10T09:00:00Z',
        updated_at: '2024-02-15T14:30:00Z',
        password: 'Start01!',
        must_change_password: true
      },
      // Employé supplémentaire pour atteindre 14
      {
        id: 14,
        first_name: 'Marie',
        last_name: 'Dupont',
        email: 'marie.dupont@madon.cm',
        phone: '+237 6 99 88 77 66',
        department: 'Administration',
        position: 'Secrétaire',
        role: 'employee',
        status: 'active',
        salary: '250000',
        hire_date: '2023-09-01',
        address: 'Quartier Akwa, Douala, Cameroun',
        emergency_contact: 'Pierre Dupont',
        emergency_phone: '+237 6 99 88 77 67',
        created_at: '2023-09-01T09:00:00Z',
        updated_at: '2024-03-01T09:00:00Z',
        password: 'Start01!',
        must_change_password: true
      }
    ];
    
    // Sauvegarder les données initiales
    localStorage.setItem('employees', JSON.stringify(initialEmployees));
    
    // Marquer comme initialisé pour éviter la re-initialisation
    localStorage.setItem('employees-initialized', 'true');
    
    console.log('✅ 14 employés conformes initialisés avec succès');
  }, []);

  // Ce composant ne rend rien, il initialise juste les employés
  return null;
};


