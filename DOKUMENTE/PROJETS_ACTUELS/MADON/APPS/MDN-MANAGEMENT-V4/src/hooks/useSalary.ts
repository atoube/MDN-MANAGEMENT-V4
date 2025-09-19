import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Employee, FichePaie } from '../types/salary';
import { calculerSalaireBrut, calculerDeductions } from './salary/calculations';
import { SalaryState, initialState } from './salary/state';

export function useSalary() {
  const [state, setState] = useState<SalaryState>(initialState);
  
  // Optimiser les calculs avec useMemo
  const eligibleEmployees = useMemo(() => 
    new Set(state.employees.filter(isEmployeeEligible).map(emp => emp.id)),
    [state.employees]
  );

  const isEmployeeEligible = useCallback((employee: Employee): boolean => {
    return (
      employee.status === 'ACTIVE' &&
      employee.typeContrat !== 'TERMINE' &&
      employee.salaireBase > 0
    );
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
// Mock from call
// Mock select call
// Mock eq call
        .order('nom');
      
      // Removed error check - using mock data
      setState(prev => ({ ...prev, employees: data }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors du chargement des employés'
      }));
      console.error(err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleSelectEmployee = useCallback((employeeId: string) => {
    setState(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId]
    }));
  }, []);

  const generateFichePaie = useCallback(async (employeeId: string) => {
    const employee = state.employees.find(e => e.id === employeeId);
    if (!employee) throw new Error('Employé non trouvé');

    const salaireBrut = calculerSalaireBrut(employee);
    const deductions = calculerDeductions(employee, salaireBrut);
    const salaireNet = salaireBrut - deductions.reduce((acc, d) => acc + d.montant, 0);

    const fichePaie: FichePaie = {
      id: crypto.randomUUID(),
      employeeId,
      datePaiement: new Date(),
      salaireBrut,
      salaireNet,
      primes: employee.primes,
      deductions,
      heuresSupplementaires: 0,
      status: 'EN_ATTENTE'
    };

    await     return fichePaie;
  }, [state.employees]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    ...state,
    eligibleEmployees,
    isEmployeeEligible,
    handleSelectEmployee,
    generateFichePaie,
    loadEmployees
  };
} 