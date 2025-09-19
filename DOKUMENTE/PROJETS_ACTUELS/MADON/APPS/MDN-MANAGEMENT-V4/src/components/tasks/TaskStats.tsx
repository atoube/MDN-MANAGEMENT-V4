import React from 'react';
import { Task } from '../../types';
import { CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-primary-600" />
        Statistiques des tâches
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
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
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Par priorité</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-2 mr-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Haute</p>
                <p className="text-lg font-bold text-gray-900">{highPriorityTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-amber-100 rounded-full p-2 mr-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Moyenne</p>
                <p className="text-lg font-bold text-gray-900">{mediumPriorityTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Basse</p>
                <p className="text-lg font-bold text-gray-900">{lowPriorityTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 