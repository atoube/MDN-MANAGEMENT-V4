import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Non défini';
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'on_hold':
        return 'En pause';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Planification';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Basse';
      default:
        return 'Non définie';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="mt-1">{project.description}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Chef de projet</div>
              <div className="mt-1">
                {project.manager ? (
                  <span>{project.manager.first_name} {project.manager.last_name}</span>
                ) : (
                  <span className="text-gray-400">Non assigné</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>État et progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Statut</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Priorité</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-1 rounded ${getPriorityColor(project.priority)}`}>
                  {getPriorityText(project.priority)}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium text-gray-500">Progression</div>
              <div className="mt-2">
                <Progress value={project.progress} className="h-2" />
                <div className="mt-1 text-sm text-gray-500 text-right">{project.progress}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates et délais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Date de début</div>
              <div className="mt-1">{formatDate(project.start_date)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Date de fin prévue</div>
              <div className="mt-1">{formatDate(project.end_date)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget et coûts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Budget total</div>
              <div className="mt-1">{project.budget?.toLocaleString()} €</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Coûts actuels</div>
              <div className="mt-1">{project.actual_cost?.toLocaleString()} €</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium text-gray-500">Utilisation du budget</div>
              <div className="mt-2">
                <Progress 
                  value={(project.actual_cost / project.budget) * 100} 
                  className="h-2"
                  indicatorClassName={project.actual_cost > project.budget ? 'bg-red-500' : undefined}
                />
                <div className="mt-1 text-sm text-gray-500 text-right">
                  {((project.actual_cost / project.budget) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objectifs et livrables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Objectifs</div>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {project.objectives?.map((objective, index) => (
                  <li key={index} className="text-gray-700">{objective}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Livrables</div>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {project.deliverables?.map((deliverable, index) => (
                  <li key={index} className="text-gray-700">{deliverable}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 