import React from 'react';
import { Task } from '../../types';
import { BarChart2, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Calendar } from 'lucide-react';

interface TaskDashboardProps {
  tasks: Task[];
}

export function TaskDashboard({ tasks }: TaskDashboardProps) {
  // Calcul des statistiques de base
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  // Calcul des statistiques par priorité
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  // Calcul du taux de complétion
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calcul des tâches en retard
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'done') return false;
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date();
  }).length;
  
  // Calcul des tâches à venir (dans les 7 prochains jours)
  const upcomingTasks = tasks.filter(task => {
    if (task.status === 'done') return false;
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="bg-primary-100 rounded-full p-2">
              <BarChart2 className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              <p className="text-xs text-gray-500">{completionRate}% complétées</p>
            </div>
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">À faire</p>
              <p className="text-2xl font-bold text-gray-900">{todoTasks}</p>
            </div>
            <div className="bg-amber-100 rounded-full p-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphiques et statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Répartition par priorité */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
            Répartition par priorité
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm font-medium">Haute priorité</span>
              </div>
              <span className="text-sm font-medium">{highPriorityTasks}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${(highPriorityTasks / totalTasks) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm font-medium">Moyenne priorité</span>
              </div>
              <span className="text-sm font-medium">{mediumPriorityTasks}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-amber-500 h-2.5 rounded-full" 
                style={{ width: `${(mediumPriorityTasks / totalTasks) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium">Basse priorité</span>
              </div>
              <span className="text-sm font-medium">{lowPriorityTasks}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(lowPriorityTasks / totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Tâches en retard et à venir */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Échéances
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">En retard</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
                </div>
                <div className="bg-red-100 rounded-full p-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">À venir (7 jours)</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingTasks}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Répartition par statut</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Terminées</p>
                    <p className="text-lg font-bold text-gray-900">{completedTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">En cours</p>
                    <p className="text-lg font-bold text-gray-900">{inProgressTasks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-full p-2 mr-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">À faire</p>
                    <p className="text-lg font-bold text-gray-900">{todoTasks}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 