import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from './useEmployees';

export interface LeaveRequest {
  id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  request_date: string;
  leave_type: 'congés_payés' | 'congés_sans_solde' | 'congés_maladie' | 'repos_compensateur' | 'congés_exceptionnels';
  start_date: string;
  end_date: string;
  number_of_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_by_name?: string;
  approval_date?: string;
  rejection_reason?: string;
  proof_documents?: string[]; // URLs des documents
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  employee_id: number;
  employee_name: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
}

export function useLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { employees } = useEmployees();

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger depuis localStorage ou utiliser les données initiales
      const savedRequests = localStorage.getItem('leave_requests');
      const savedBalances = localStorage.getItem('leave_balances');

      if (savedRequests) {
        setLeaveRequests(JSON.parse(savedRequests));
      } else {
        const initialRequests = getInitialLeaveRequests();
        setLeaveRequests(initialRequests);
        localStorage.setItem('leave_requests', JSON.stringify(initialRequests));
      }

      if (savedBalances) {
        setLeaveBalances(JSON.parse(savedBalances));
      } else {
        const initialBalances = getInitialLeaveBalances();
        setLeaveBalances(initialBalances);
        localStorage.setItem('leave_balances', JSON.stringify(initialBalances));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes de congés:', error);
      toast.error('Erreur lors du chargement des demandes de congés');
    } finally {
      setLoading(false);
    }
  };

  // Données initiales mockées
  const getInitialLeaveRequests = (): LeaveRequest[] => [
    {
      id: '1',
      employee_id: 2,
      employee_name: 'Fatou Ndiaye',
      employee_email: 'fatou.ndiaye@madon.com',
      request_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      leave_type: 'congés_payés',
      start_date: '2024-02-15',
      end_date: '2024-02-20',
      number_of_days: 5,
      reason: 'Vacances familiales - Voyage au Sénégal pour retrouver la famille',
      status: 'pending',
      proof_documents: ['billet_avion.pdf', 'reservation_hotel.pdf'],
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      employee_id: 3,
      employee_name: 'Arantes Mbinda',
      employee_email: 'arantes.mbinda@madon.com',
      request_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      leave_type: 'congés_maladie',
      start_date: '2024-02-10',
      end_date: '2024-02-12',
      number_of_days: 2,
      reason: 'Consultation médicale et examens de routine',
      status: 'approved',
      approved_by: 1,
      approved_by_name: 'Ahmadou Bello',
      approval_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      proof_documents: ['certificat_medical.pdf', 'ordonnance_medecin.pdf'],
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      employee_id: 4,
      employee_name: 'Marie Kouam',
      employee_email: 'marie.kouam@madon.com',
      request_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      leave_type: 'congés_maladie',
      start_date: '2024-02-14',
      end_date: '2024-02-16',
      number_of_days: 3,
      reason: 'Grippe et fièvre - Repos médical prescrit',
      status: 'pending',
      proof_documents: ['arret_travail.pdf', 'certificat_medical.pdf', 'ordonnance_medicaments.pdf'],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      employee_id: 5,
      employee_name: 'Jean Baptiste',
      employee_email: 'jean.baptiste@madon.com',
      request_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      leave_type: 'congés_exceptionnels',
      start_date: '2024-02-18',
      end_date: '2024-02-19',
      number_of_days: 2,
      reason: 'Mariage de ma sœur - Cérémonie familiale importante',
      status: 'rejected',
      approved_by: 1,
      approved_by_name: 'Ahmadou Bello',
      approval_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      rejection_reason: 'Période de forte activité - Demande reportée au mois prochain',
      proof_documents: ['invitation_mariage.pdf', 'programme_ceremonie.pdf'],
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      employee_id: 6,
      employee_name: 'Kouassi Ndedi',
      employee_email: 'k.ndedi@themadon.com',
      request_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      leave_type: 'congés_maladie',
      start_date: '2024-02-20',
      end_date: '2024-02-22',
      number_of_days: 3,
      reason: 'Palu sans hospitalisation - Repos médical prescrit',
      status: 'pending',
      proof_documents: ['certificat_medical.pdf', 'ordonnance_medicaments.pdf', 'arret_travail.pdf', 'photo_medicale.jpg', 'rapport_medical.docx'],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getInitialLeaveBalances = (): LeaveBalance[] => [
    {
      employee_id: 1,
      employee_name: 'Ahmadou Bello',
      total_days: 25,
      used_days: 8,
      remaining_days: 17,
      year: 2024
    },
    {
      employee_id: 2,
      employee_name: 'Fatou Ndiaye',
      total_days: 25,
      used_days: 12,
      remaining_days: 13,
      year: 2024
    },
    {
      employee_id: 3,
      employee_name: 'Arantes Mbinda',
      total_days: 25,
      used_days: 5,
      remaining_days: 20,
      year: 2024
    }
  ];

  // Créer une nouvelle demande de congés
  const createLeaveRequest = async (requestData: Omit<LeaveRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      // Si l'email est fourni mais pas le nom, essayer de récupérer les infos de l'employé
      let enrichedRequestData = { ...requestData };
      
      if (requestData.employee_email && !requestData.employee_name) {
        // Récupérer les informations de l'employé depuis localStorage
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          const employees: any[] = JSON.parse(savedEmployees);
          const employee = employees.find(emp => emp.email === requestData.employee_email);
          
          if (employee) {
            enrichedRequestData = {
              ...requestData,
              employee_name: `${employee.first_name} ${employee.last_name}`,
              employee_email: employee.email
            };
            console.log('✅ Informations employé auto-remplies:', {
              email: employee.email,
              name: `${employee.first_name} ${employee.last_name}`
            });
          } else {
            console.warn('⚠️ Employé non trouvé pour l\'email:', requestData.employee_email);
          }
        }
      }

      const newRequest: LeaveRequest = {
        ...enrichedRequestData,
        id: Date.now().toString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedRequests = [...leaveRequests, newRequest];
      setLeaveRequests(updatedRequests);
      localStorage.setItem('leave_requests', JSON.stringify(updatedRequests));

      toast.success('Demande de congés créée avec succès');
      return newRequest;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast.error('Erreur lors de la création de la demande');
      throw error;
    }
  };

  // Approuver une demande de congés
  const approveLeaveRequest = async (requestId: string, approverId: number, approverName: string, notes?: string) => {
    try {
      const updatedRequests = leaveRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: 'approved' as const,
            approved_by: approverId,
            approved_by_name: approverName,
            approval_date: new Date().toISOString(),
            notes,
            updated_at: new Date().toISOString()
          };
        }
        return request;
      });

      setLeaveRequests(updatedRequests);
      localStorage.setItem('leave_requests', JSON.stringify(updatedRequests));

      // Mettre à jour le solde de congés
      const request = leaveRequests.find(r => r.id === requestId);
      if (request) {
        updateLeaveBalance(request.employee_id, request.number_of_days);
      }

      toast.success('Demande de congés approuvée');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation');
      throw error;
    }
  };

  // Rejeter une demande de congés
  const rejectLeaveRequest = async (requestId: string, approverId: number, approverName: string, rejectionReason: string) => {
    try {
      const updatedRequests = leaveRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: 'rejected' as const,
            approved_by: approverId,
            approved_by_name: approverName,
            approval_date: new Date().toISOString(),
            rejection_reason: rejectionReason,
            updated_at: new Date().toISOString()
          };
        }
        return request;
      });

      setLeaveRequests(updatedRequests);
      localStorage.setItem('leave_requests', JSON.stringify(updatedRequests));

      toast.success('Demande de congés rejetée');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet');
      throw error;
    }
  };

  // Mettre à jour le solde de congés
  const updateLeaveBalance = (employeeId: number, usedDays: number) => {
    const updatedBalances = leaveBalances.map(balance => {
      if (balance.employee_id === employeeId) {
        return {
          ...balance,
          used_days: balance.used_days + usedDays,
          remaining_days: balance.total_days - (balance.used_days + usedDays)
        };
      }
      return balance;
    });

    setLeaveBalances(updatedBalances);
    localStorage.setItem('leave_balances', JSON.stringify(updatedBalances));
  };

  // Obtenir les demandes d'un employé
  const getEmployeeLeaveRequests = useCallback((employeeId: number): LeaveRequest[] => {
    return leaveRequests.filter(request => request.employee_id === employeeId);
  }, [leaveRequests]);

  // Obtenir les demandes en attente d'approbation
  const getPendingRequests = useCallback((): LeaveRequest[] => {
    return leaveRequests.filter(request => request.status === 'pending');
  }, [leaveRequests]);

  // Obtenir le solde de congés d'un employé
  const getEmployeeLeaveBalance = useCallback((employeeId: number): LeaveBalance | undefined => {
    return leaveBalances.find(balance => balance.employee_id === employeeId);
  }, [leaveBalances]);

  return {
    // État
    leaveRequests,
    leaveBalances,
    loading,

    // Actions
    loadData,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    updateLeaveBalance,

    // Getters
    getEmployeeLeaveRequests,
    getPendingRequests,
    getEmployeeLeaveBalance
  };
}
