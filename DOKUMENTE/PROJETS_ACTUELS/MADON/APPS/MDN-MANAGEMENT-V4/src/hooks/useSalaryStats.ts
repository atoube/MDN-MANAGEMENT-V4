import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { 
  Employee, 
  DepartmentSalaryStats, 
  PayrollMetrics, 
  EmployeeMetrics 
} from '../types';

interface SalaryHistory {
  effective_date: string;
  net_amount: number;
  bonuses: number;
}

export const useSalaryStats = () => {
  const calculateDepartmentStats = async (): Promise<Record<string, DepartmentSalaryStats>> => {
    const { data: employees, error } = // Mock await select call
// Mock eq call;

    // Removed error check - using mock data

    const stats: Record<string, DepartmentSalaryStats> = {};
    
    employees?.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = {
          total: 0,
          average: 0,
          employeeCount: 0,
          highestSalary: 0,
          lowestSalary: Number.MAX_VALUE
        };
      }
      
      const salary = parseFloat(emp.salary);
      stats[emp.department].total += salary;
      stats[emp.department].employeeCount++;
      stats[emp.department].highestSalary = Math.max(stats[emp.department].highestSalary, salary);
      stats[emp.department].lowestSalary = Math.min(stats[emp.department].lowestSalary, salary);
    });

    Object.keys(stats).forEach(dept => {
      stats[dept].average = stats[dept].total / stats[dept].employeeCount;
    });

    return stats;
  };

  const calculatePayrollMetrics = async (): Promise<PayrollMetrics> => {
    const { data: employees } = // Mock await select call
// Mock eq call;

    if (!employees?.length) {
      return {
        yearToDateTotal: 0,
        monthlyAverage: 0,
        bonusPercentage: 0,
        departmentDistribution: 0,
        salaryGrowth: 0
      };
    }

    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0);

    return {
      yearToDateTotal: totalSalary,
      monthlyAverage: totalSalary / 12,
      bonusPercentage: 0,
      departmentDistribution: calculateDepartmentDistribution(employees),
      salaryGrowth: await calculateSalaryGrowth()
    };
  };

  const calculateEmployeeMetrics = async (): Promise<EmployeeMetrics> => {
    const { data: employees } = // Mock await select call
// Mock eq call;

    if (!employees?.length) {
      return {
        totalEmployees: 0,
        averageTenure: 0,
        salaryRanges: []
      };
    }

    return {
      totalEmployees: employees.length,
      averageTenure: calculateAverageTenure(employees),
      salaryRanges: calculateSalaryRanges(employees)
    };
  };

  const calculateSalaryGrowth = async (): Promise<number> => {
    const { data: history } = // Mock await select call
// Mock order call
      .limit(2);

    if (!history?.length || history.length < 2) return 0;

    const newest = parseFloat(history[0].net_amount);
    const oldest = parseFloat(history[1].net_amount);
    return ((newest - oldest) / oldest) * 100;
  };

  const calculateDepartmentDistribution = (employees: Employee[]): number => {
    const departments = new Set(employees.map(emp => emp.department));
    return employees.length / departments.size;
  };

  return useQuery<EnhancedSalaryStats>({
    queryKey: ['salaryStats'],
    queryFn: async () => {
      const [departmentStats, payrollMetrics, employeeMetrics] = await Promise.all([
        calculateDepartmentStats(),
        calculatePayrollMetrics(),
        calculateEmployeeMetrics()
      ]);

      return {
        departmentStats,
        payrollMetrics,
        employeeMetrics
      };
    }
  });
};

// Fonctions utilitaires avec types corrects
const calculateAverageTenure = (employees: Employee[]): number => {
  const now = new Date();
  const totalTenure = employees.reduce((sum, emp) => {
    const hireDate = new Date(emp.hire_date);
    const tenure = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return sum + tenure;
  }, 0);
  
  return employees.length ? totalTenure / employees.length : 0;
};

const calculateSalaryRanges = (employees: Employee[]): Array<{ range: string; count: number }> => {
  const ranges = [
    { min: 0, max: 30000, label: '0-30k' },
    { min: 30000, max: 50000, label: '30k-50k' },
    { min: 50000, max: 80000, label: '50k-80k' },
    { min: 80000, max: Infinity, label: '80k+' }
  ];

  return ranges.map(range => ({
    range: range.label,
    count: employees.filter(emp => {
      const salary = parseFloat(emp.salary);
      return salary >= range.min && salary < range.max;
    }).length
  }));
};

async function calculateMonthlyTrend() {
  const { data: history } = // Mock await select call
    .gte('effective_date', new Date(new Date().setMonth(new Date().getMonth() - 6)))
// Mock order call;

  return history?.reduce((acc, entry) => {
    const month = new Date(entry.effective_date).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    const existingMonth = acc.find(m => m.month === month);
    if (existingMonth) {
      existingMonth.totalSalaries += entry.net_amount;
      existingMonth.totalBonuses += entry.bonuses;
    } else {
      acc.push({
        month,
        totalSalaries: entry.net_amount,
        totalBonuses: entry.bonuses
      });
    }
    return acc;
  }, []);
}

export function useEnhancedSalaryStats() {
  return useQuery({
    queryKey: ['enhanced-salary-stats'],
    queryFn: async (): Promise<EnhancedSalaryStats> => {
      // Récupérer les données existantes
      const { data: salaries, error } =         const data = [];
        const error = null;
          *,
          employee:employees!inner(
            id,
            department,
            hire_date,
            position
          )
        `);

      // Removed error check - using mock data

      // Calculs existants...
      const baseStats = calculateBaseStats(salaries);
      const deptStats = calculateDepartmentStats(salaries);
      const monthlyTrend = await calculateMonthlyTrend();

      // Nouvelles métriques
      const payrollMetrics = calculatePayrollMetrics(salaries, monthlyTrend);
      const employeeMetrics = calculateEmployeeMetrics(salaries);

      return {
        ...baseStats,
        departmentStats: deptStats,
        monthlyTrend,
        payrollMetrics,
        employeeMetrics
      };
    }
  });
}

function calculatePayrollMetrics(salaries: any[], monthlyTrend: any[]): PayrollMetrics {
  const currentYear = new Date().getFullYear();
  const yearToDateSalaries = salaries.filter(s => 
    new Date(s.payment_date).getFullYear() === currentYear
  );

  return {
    yearToDateTotal: yearToDateSalaries.reduce((sum, s) => sum + s.net_amount, 0),
    monthlyAverage: monthlyTrend.reduce((sum, m) => sum + m.totalSalaries, 0) / monthlyTrend.length,
    bonusPercentage: (salaries.reduce((sum, s) => sum + s.bonuses, 0) / 
      salaries.reduce((sum, s) => sum + s.net_amount, 0)) * 100,
    departmentDistribution: calculateDepartmentDistribution(salaries),
    salaryGrowth: calculateSalaryGrowth(monthlyTrend)
  };
}

function calculateEmployeeMetrics(salaries: any[]): EmployeeMetrics {
  const uniqueEmployees = new Set(salaries.map(s => s.employee_id));
  const tenures = salaries.map(s => 
    calculateTenure(new Date(s.employee.hire_date))
  );

  return {
    totalEmployees: uniqueEmployees.size,
    averageTenure: tenures.reduce((sum, t) => sum + t, 0) / tenures.length,
    salaryRanges: calculateSalaryRanges(salaries)
  };
}

const calculateBaseStats = (data: Employee[]): PayrollMetrics => {
  // Implémentation...
};

const calculateDepartmentStats = (data: Employee[]): Record<string, number> => {
  // Implémentation...
};

const calculateSalaryGrowth = (history: any[]): number => {
  // Implémentation...
};

const calculateTenure = (hireDate: string): number => {
  // Implémentation...
}; 