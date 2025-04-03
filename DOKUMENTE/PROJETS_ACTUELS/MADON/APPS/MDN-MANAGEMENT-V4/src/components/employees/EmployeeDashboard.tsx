import { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from '../ui/Card';
import type { Employee } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EmployeeDashboardProps {
  employee: Employee;
}

export function EmployeeDashboard({ employee }: EmployeeDashboardProps) {
  useEffect(() => {
    // Create performance chart
    const performanceCtx = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (performanceCtx) {
      new ChartJS(performanceCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Performance',
            data: [65, 70, 75, 80, 85, 90],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // Create attendance chart
    const attendanceCtx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (attendanceCtx) {
      new ChartJS(attendanceCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Présence',
            data: [95, 92, 98, 96, 94, 97],
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      const performanceChart = ChartJS.getChart(performanceCtx);
      const attendanceChart = ChartJS.getChart(attendanceCtx);
      if (performanceChart) performanceChart.destroy();
      if (attendanceChart) attendanceChart.destroy();
    };
  }, []);

  // Calcul des métriques
  const calculateMetrics = () => {
    const today = new Date();
    const hireDate = new Date(employee.hire_date);
    const yearsOfService = today.getFullYear() - hireDate.getFullYear();
    
    const attendanceRate = employee.attendance?.absences !== undefined
      ? ((employee.attendance.regular_hours?.days?.length || 0) - (employee.attendance.absences || 0)) / 
        (employee.attendance.regular_hours?.days?.length || 1) * 100
      : 0;

    const leaveBalance = employee.leave_balance || {
      annual: 0,
      sick: 0,
      other: 0
    };

    const totalLeaveDays = leaveBalance.annual + leaveBalance.sick + leaveBalance.other;

    return {
      yearsOfService,
      attendanceRate,
      totalLeaveDays,
      performanceScore: employee.performance_reviews?.[0]?.rating || 0,
      trainingCompletion: employee.training_history?.filter((t: { completion_status: string }) => 
        t.completion_status === 'completed'
      ).length || 0
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900">Années de service</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.yearsOfService}</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900">Taux de présence</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.attendanceRate.toFixed(1)}%</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900">Jours de congés restants</h3>
          <p className="text-3xl font-bold text-orange-600">{metrics.totalLeaveDays}</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900">Score de performance</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.performanceScore}/5</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900">Formations complétées</h3>
          <p className="text-3xl font-bold text-indigo-600">{metrics.trainingCompletion}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des performances</h3>
          <canvas id="performanceChart" />
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des congés</h3>
          <canvas id="attendanceChart" />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Objectifs en cours</h3>
        <div className="space-y-4">
          {employee.professional_goals?.short_term.map((goal, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={false}
                readOnly
              />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 