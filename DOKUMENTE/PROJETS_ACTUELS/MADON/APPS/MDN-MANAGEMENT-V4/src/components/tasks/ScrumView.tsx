import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useSprints } from '../../hooks/useSprints';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { SprintModal } from './SprintModal';
import { TaskCard } from './TaskCard';

interface ScrumViewProps {
  projectId: string;
}

export function ScrumView({ projectId }: ScrumViewProps) {
  const { user } = useAuth();
  const { 
    sprints, 
    createSprint, 
    updateSprint, 
    deleteSprint,
    getVisibleSprints,
    getActiveSprint 
  } = useSprints();
  const { 
    tasks, 
    filteredTasks, 
    addTaskToSprint, 
    removeTaskFromSprint 
  } = useTasks(projectId);
  
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<any>(null);

  const visibleSprints = getVisibleSprints();
  const activeSprint = getActiveSprint();

  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSprintStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'active': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSprintTasks = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint) return [];
    
    return filteredTasks.filter(task => sprint.tasks.includes(task.id));
  };

  const getSprintProgress = (sprintId: string) => {
    const sprintTasks = getSprintTasks(sprintId);
    if (sprintTasks.length === 0) return 0;
    
    const completedTasks = sprintTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / sprintTasks.length) * 100);
  };

  const handleCreateSprint = (sprintData: any) => {
    try {
      createSprint(sprintData);
      setIsSprintModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du sprint:', error);
    }
  };

  const handleUpdateSprint = (sprintId: string, updates: any) => {
    try {
      updateSprint(sprintId, updates);
      setSelectedSprint(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du sprint:', error);
    }
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sprint ?')) {
      try {
        deleteSprint(sprintId);
      } catch (error) {
        console.error('Erreur lors de la suppression du sprint:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sprint actif */}
      {activeSprint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{activeSprint.name}</CardTitle>
                  <p className="text-sm text-gray-600">{activeSprint.description}</p>
                </div>
              </div>
              <Badge className={getSprintStatusColor(activeSprint.status)}>
                {getSprintStatusIcon(activeSprint.status)}
                <span className="ml-1 capitalize">{activeSprint.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSprint.goal && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Objectif du Sprint</h4>
                  <p className="text-sm text-gray-600">{activeSprint.goal}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(activeSprint.startDate).toLocaleDateString('fr-FR')} - {new Date(activeSprint.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getSprintTasks(activeSprint.id).length} tâches
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getSprintProgress(activeSprint.id)}% terminé
                  </span>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSprintProgress(activeSprint.id)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des sprints */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sprints
            </CardTitle>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Button onClick={() => setIsSprintModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Sprint
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {visibleSprints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun sprint disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleSprints.map((sprint) => (
                <Card key={sprint.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{sprint.name}</h3>
                          <p className="text-sm text-gray-600">{sprint.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSprintStatusColor(sprint.status)}>
                          {getSprintStatusIcon(sprint.status)}
                          <span className="ml-1 capitalize">{sprint.status}</span>
                        </Badge>
                        {(user?.role === 'admin' || user?.role === 'manager') && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSprint(sprint)}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSprint(sprint.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(sprint.startDate).toLocaleDateString('fr-FR')} - {new Date(sprint.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {getSprintTasks(sprint.id).length} tâches
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {getSprintProgress(sprint.id)}% terminé
                          </span>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getSprintProgress(sprint.id)}%` }}
                        ></div>
                      </div>
                      
                      {/* Tâches du sprint */}
                      {getSprintTasks(sprint.id).length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Tâches du Sprint</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {getSprintTasks(sprint.id).map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {isSprintModalOpen && (
        <SprintModal
          isOpen={isSprintModalOpen}
          onClose={() => setIsSprintModalOpen(false)}
          onSubmit={handleCreateSprint}
        />
      )}
      
      {selectedSprint && (
        <SprintModal
          isOpen={!!selectedSprint}
          onClose={() => setSelectedSprint(null)}
          onSubmit={(data) => handleUpdateSprint(selectedSprint.id, data)}
          sprint={selectedSprint}
        />
      )}
    </div>
  );
}
