import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary?: number;
  hire_date?: string;
  photo_url?: string;
  avatar_id?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
  must_change_password?: boolean;
}

const API_BASE_URL = 'https://management.themadon.com/.netlify/functions';

export function useEmployeesAPI() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Charger les employés depuis l'API
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        setError('Erreur lors du chargement des employés');
        console.error('Erreur lors du chargement des employés:', response.statusText);
      }
    } catch (error) {
      setError('Erreur lors du chargement des employés');
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les employés au montage du composant
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Créer un nouvel employé
  const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees(prev => [newEmployee, ...prev]);
        return newEmployee;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de l\'employé');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }
  }, []);

  // Mettre à jour un employé
  const updateEmployee = useCallback(async (id: number | string, employeeData: Partial<Employee>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees(prev => 
          prev.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp)
        );
        return updatedEmployee;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'employé');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      throw error;
    }
  }, []);

  // Supprimer un employé
  const deleteEmployee = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'employé');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      throw error;
    }
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
}
