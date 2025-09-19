import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from './useEmployees';
import { useTasks } from './useTasks';
import { useLeaveRequests } from './useLeaveRequests';
import { useGamification } from './useGamification';
import { useTimeTracking } from './useTimeTracking';

export function useRoleBasedMetrics() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { tasks } = useTasks('default-project');
  const { leaveRequests } = useLeaveRequests();
  const { getUserStats, getLeaderboard } = useGamification();
  const { getUserTimeStats } = useTimeTracking();

  const metrics = useMemo(() => {
    if (!user) return null;

    const currentEmployee = employees.find(emp => emp.id.toString() === user.id.toString());
    const userDepartment = currentEmployee?.department;

    // Métriques pour l'employé connecté
    const userTasks = tasks.filter(task => 
      task.assigned_to === user.id.toString() || task.created_by === user.id.toString()
    );
    
    const userLeaveRequests = leaveRequests.filter(request => 
      request.employee_id.toString() === user.id.toString()
    );

    const userStats = getUserStats(user.id.toString());
    const userTimeStats = getUserTimeStats(user.id.toString());

    // Métriques selon le rôle
    let roleMetrics = {
      personal: {
        tasks: {
          total: userTasks.length,
          completed: userTasks.filter(t => t.status === 'done').length,
          inProgress: userTasks.filter(t => t.status === 'in_progress').length,
          pending: userTasks.filter(t => t.status === 'todo').length,
          overdue: userTasks.filter(t => 
            t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
          ).length
        },
        leaveRequests: {
          total: userLeaveRequests.length,
          pending: userLeaveRequests.filter(r => r.status === 'pending').length,
          approved: userLeaveRequests.filter(r => r.status === 'approved').length,
          rejected: userLeaveRequests.filter(r => r.status === 'rejected').length
        },
        gamification: {
          points: userStats?.totalPoints || 0,
          level: userStats?.level || 1,
          badges: userStats?.badges?.length || 0,
          rank: userStats?.rank || 0
        },
        timeTracking: {
          totalHours: userTimeStats?.totalHours || 0,
          todayHours: userTimeStats?.todayHours || 0,
          thisWeekHours: userTimeStats?.thisWeekHours || 0,
          averageHours: userTimeStats?.averageHours || 0
        }
      },
      department: null as any,
      global: null as any
    };

    // Métriques pour les managers de département
    if (user.role === 'hr' || user.role === 'admin' || 
        (currentEmployee && ['manager', 'supervisor'].includes(currentEmployee.position.toLowerCase()))) {
      
      const departmentEmployees = employees.filter(emp => emp.department === userDepartment);
      const departmentTasks = tasks.filter(task => 
        departmentEmployees.some(emp => 
          emp.id.toString() === task.assigned_to || emp.id.toString() === task.created_by
        )
      );
      
      const departmentLeaveRequests = leaveRequests.filter(request =>
        departmentEmployees.some(emp => emp.id.toString() === request.employee_id.toString())
      );

      roleMetrics.department = {
        employees: {
          total: departmentEmployees.length,
          active: departmentEmployees.filter(emp => emp.status === 'active').length,
          onLeave: departmentEmployees.filter(emp => emp.status === 'on_leave').length
        },
        tasks: {
          total: departmentTasks.length,
          completed: departmentTasks.filter(t => t.status === 'done').length,
          inProgress: departmentTasks.filter(t => t.status === 'in_progress').length,
          pending: departmentTasks.filter(t => t.status === 'todo').length,
          overdue: departmentTasks.filter(t => 
            t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
          ).length
        },
        leaveRequests: {
          total: departmentLeaveRequests.length,
          pending: departmentLeaveRequests.filter(r => r.status === 'pending').length,
          approved: departmentLeaveRequests.filter(r => r.status === 'approved').length,
          rejected: departmentLeaveRequests.filter(r => r.status === 'rejected').length
        },
        productivity: {
          averageCompletionRate: departmentTasks.length > 0 
            ? (departmentTasks.filter(t => t.status === 'done').length / departmentTasks.length) * 100 
            : 0,
          averageResponseTime: 0 // À calculer selon les besoins
        }
      };
    }

    // Métriques pour les admins
    if (user.role === 'admin') {
      const allTasks = tasks;
      const allLeaveRequests = leaveRequests;
      const leaderboard = getLeaderboard();

      roleMetrics.global = {
        employees: {
          total: employees.length,
          active: employees.filter(emp => emp.status === 'active').length,
          onLeave: employees.filter(emp => emp.status === 'on_leave').length,
          inactive: employees.filter(emp => emp.status === 'inactive').length
        },
        tasks: {
          total: allTasks.length,
          completed: allTasks.filter(t => t.status === 'done').length,
          inProgress: allTasks.filter(t => t.status === 'in_progress').length,
          pending: allTasks.filter(t => t.status === 'todo').length,
          overdue: allTasks.filter(t => 
            t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
          ).length
        },
        leaveRequests: {
          total: allLeaveRequests.length,
          pending: allLeaveRequests.filter(r => r.status === 'pending').length,
          approved: allLeaveRequests.filter(r => r.status === 'approved').length,
          rejected: allLeaveRequests.filter(r => r.status === 'rejected').length
        },
        gamification: {
          topPerformers: leaderboard.slice(0, 5),
          totalPoints: leaderboard.reduce((sum, user) => sum + user.totalPoints, 0),
          averagePoints: leaderboard.length > 0 
            ? leaderboard.reduce((sum, user) => sum + user.totalPoints, 0) / leaderboard.length 
            : 0
        },
        productivity: {
          averageCompletionRate: allTasks.length > 0 
            ? (allTasks.filter(t => t.status === 'done').length / allTasks.length) * 100 
            : 0,
          departments: employees.reduce((acc, emp) => {
            if (!acc[emp.department]) {
              acc[emp.department] = 0;
            }
            acc[emp.department]++;
            return acc;
          }, {} as Record<string, number>)
        }
      };
    }

    return roleMetrics;
  }, [user, employees, tasks, leaveRequests, getUserStats, getLeaderboard, getUserTimeStats]);

  return {
    metrics,
    userRole: user?.role,
    userDepartment: employees.find(emp => emp.id.toString() === user?.id.toString())?.department
  };
}
