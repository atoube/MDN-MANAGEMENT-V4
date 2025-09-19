import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Employee } from '../types';

interface EmployeeExtendedData {
  performance_metrics: {
    efficiency: number;
    punctuality: number;
    quality: number;
  };
  training_history: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    date: string;
    valid_until: string;
  }>;
}

export function useEmployeeData(employeeId: string) {
  const queryClient = useQueryClient();

  // Données de base de l'employé avec relations
  const employeeQuery = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      // Mock data pour l'employé avec contexte camerounais
      const employeesData = {
        '1': {
          id: '1',
          first_name: 'Ahmadou',
          last_name: 'Bello',
          email: 'ahmadou.bello@madon.cm',
          phone: '+237 6 94 12 34 56',
          position: 'Développeur Senior',
          department: 'Informatique',
          salary: 450000, // F.CFA
          status: 'active',
          hire_date: '2022-03-15',
          created_at: '2022-03-15T10:00:00Z',
          updated_at: '2024-03-01T14:30:00Z',
          address: 'Quartier Akwa, Douala, Cameroun',
          projects: [
            { id: '1', name: 'Système de Gestion Commerciale', role: 'Lead Développeur' },
            { id: '2', name: 'Application Mobile MDN', role: 'Développeur' }
          ],
          absences: [
            { id: '1', type: 'congé payé', start_date: '2024-03-01', end_date: '2024-03-05' },
            { id: '2', type: 'congé maladie', start_date: '2024-02-15', end_date: '2024-02-17' }
          ],
          deliveries: [
            { id: '1', status: 'completed', client_name: 'SARL Tech Solutions' },
            { id: '2', status: 'in_progress', client_name: 'Entreprise Douala Plus' }
          ],
          sales: [
            { id: '1', amount: 2500000, date: '2024-03-01' }, // F.CFA
            { id: '2', amount: 1800000, date: '2024-02-28' }  // F.CFA
          ],
          salary_info: {
            base_salary: 450000, // F.CFA
            bonus: 75000,        // F.CFA
            last_increase: '2024-01-01'
          }
        },
        '2': {
          id: '2',
          first_name: 'Fatou',
          last_name: 'Ndiaye',
          email: 'fatou.ndiaye@madon.cm',
          phone: '+237 6 95 23 45 67',
          position: 'Chef de Projet',
          department: 'Gestion de Projet',
          salary: 550000, // F.CFA
          status: 'active',
          hire_date: '2021-08-20',
          created_at: '2021-08-20T09:00:00Z',
          updated_at: '2024-03-01T16:45:00Z',
          address: 'Quartier Bastos, Yaoundé, Cameroun',
          projects: [
            { id: '3', name: 'Digitalisation des Services', role: 'Chef de Projet' },
            { id: '4', name: 'Infrastructure Cloud', role: 'Manager' }
          ],
          absences: [
            { id: '3', type: 'congé payé', start_date: '2024-04-15', end_date: '2024-04-20' }
          ],
          deliveries: [
            { id: '3', status: 'completed', client_name: 'Banque Atlantique Cameroun' }
          ],
          sales: [
            { id: '3', amount: 5000000, date: '2024-03-01' } // F.CFA
          ],
          salary_info: {
            base_salary: 550000, // F.CFA
            bonus: 100000,       // F.CFA
            last_increase: '2023-12-01'
          }
        },
        '3': {
          id: '3',
          first_name: 'Kouassi',
          last_name: 'Mensah',
          email: 'kouassi.mensah@madon.cm',
          phone: '+237 6 96 34 56 78',
          position: 'Commercial Senior',
          department: 'Ventes',
          salary: 380000, // F.CFA
          status: 'active',
          hire_date: '2023-01-10',
          created_at: '2023-01-10T08:30:00Z',
          updated_at: '2024-03-01T12:15:00Z',
          address: 'Quartier Bonamoussadi, Douala, Cameroun',
          projects: [
            { id: '5', name: 'Expansion Marché Ouest', role: 'Commercial' }
          ],
          absences: [
            { id: '4', type: 'congé sans solde', start_date: '2024-05-10', end_date: '2024-05-15' }
          ],
          deliveries: [
            { id: '4', status: 'pending', client_name: 'Groupe Socapalm' },
            { id: '5', status: 'completed', client_name: 'Cimencam' }
          ],
          sales: [
            { id: '4', amount: 3200000, date: '2024-03-01' }, // F.CFA
            { id: '5', amount: 2800000, date: '2024-02-25' }  // F.CFA
          ],
          salary_info: {
            base_salary: 380000, // F.CFA
            bonus: 120000,       // F.CFA (bonus élevé pour les ventes)
            last_increase: '2024-01-01'
          }
        }
      };

      const data = employeesData[employeeId as keyof typeof employeesData] || employeesData['1'];

      return data as unknown as Employee;
    }
  });

  // Données étendues de l'employé
  const extendedDataQuery = useQuery({
    queryKey: ['employee-extended', employeeId],
    queryFn: async () => {
      // Mock data pour les données étendues
      const data = {
        performance_metrics: {
          efficiency: 0.85,
          punctuality: 0.92,
          quality: 0.88
        },
        training_history: [
          { id: '1', name: 'Formation React', date: '2024-01-15', status: 'completed' }
        ],
        certifications: [
          { id: '1', name: 'Certification AWS', date: '2023-12-01', valid_until: '2025-12-01' }
        ]
      };

      return data as EmployeeExtendedData;
    }
  });

  // Mutation pour mettre à jour l'employé avec impact sur les autres modules
  const updateEmployee = useMutation({
    mutationFn: async (updates: Partial<Employee>) => {
      // Mock update operation
      console.log('Mise à jour de l\'employé:', updates);

      // Mettre à jour les modules affectés si nécessaire
      if (updates.status === 'inactive') {
        console.log('Employé désactivé - mise à jour des modules affectés');
      }
    },
    onSuccess: () => {
      // Invalider toutes les requêtes concernées
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    employee: employeeQuery.data,
    extendedData: extendedDataQuery.data,
    isLoading: employeeQuery.isLoading || extendedDataQuery.isLoading,
    updateEmployee: updateEmployee.mutate
  };
} 