import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Timer,
  Edit3,
  Trash2
} from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useAuth } from '../../contexts/AuthContext';

interface TaskTimerProps {
  taskId: string;
  taskTitle: string;
  onTimeUpdate?: (stats: any) => void;
  compact?: boolean;
}

export function TaskTimer({ taskId, taskTitle, onTimeUpdate, compact = false }: TaskTimerProps) {
  const { user } = useAuth();
  const {
    startTimer,
    stopTimer,
    getElapsedTime,
    getTaskTimeStats,
    formatTime,
    isTimerActive,
    deleteTimeEntry,
    updateTimeEntry
  } = useTimeTracking();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');

  const timerActive = isTimerActive(taskId);
  const stats = getTaskTimeStats(taskId);

  // Mettre à jour le temps écoulé toutes les secondes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(getElapsedTime(taskId));
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, taskId, getElapsedTime]);

  // Notifier le parent des changements de temps
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(stats);
    }
  }, [stats, onTimeUpdate]);

  const handleStartTimer = () => {
    startTimer(taskId, editDescription || undefined);
    setEditDescription('');
  };

  const handleStopTimer = () => {
    stopTimer(taskId);
  };

  const handleEditEntry = (entryId: string) => {
    const entry = stats.entries.find(e => e.id === entryId);
    if (entry) {
      setEditDescription(entry.description || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (entryId: string) => {
    updateTimeEntry(entryId, { description: editDescription });
    setIsEditing(false);
    setEditDescription('');
  };

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée de temps ?')) {
      deleteTimeEntry(entryId);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {timerActive ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Timer className="h-4 w-4 animate-pulse" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStopTimer}
              className="h-6 w-6 p-0"
            >
              <Square className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartTimer}
            className="h-6 w-6 p-0"
          >
            <Play className="h-3 w-3" />
          </Button>
        )}
        
        {stats.totalTime > 0 && (
          <Badge variant="secondary" className="text-xs">
            {formatTime(stats.totalTime)}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* En-tête avec titre de la tâche */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {taskTitle}
            </h3>
            {stats.totalTime > 0 && (
              <Badge variant="secondary">
                Total: {formatTime(stats.totalTime)}
              </Badge>
            )}
          </div>

          {/* Timer principal */}
          <div className="flex items-center justify-center gap-4">
            {timerActive ? (
              <div className="text-center">
                <div className="text-2xl font-mono text-green-600 mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-green-600 animate-pulse" />
                  <span className="text-sm text-green-600">En cours...</span>
                </div>
                <Button
                  onClick={handleStopTimer}
                  className="mt-2 bg-red-600 hover:bg-red-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-mono text-gray-400 mb-2">
                  {formatTime(0)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Arrêté</span>
                </div>
                <Button
                  onClick={handleStartTimer}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer
                </Button>
              </div>
            )}
          </div>

          {/* Description optionnelle */}
          {!timerActive && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">
                Description (optionnelle)
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Que faites-vous sur cette tâche ?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Statistiques rapides */}
          {stats.totalTime > 0 && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-xs text-gray-600">Aujourd'hui</div>
                <div className="text-sm font-medium">{formatTime(stats.todayTime)}</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-xs text-gray-600">Cette semaine</div>
                <div className="text-sm font-medium">{formatTime(stats.weekTime)}</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-xs text-gray-600">Moyenne</div>
                <div className="text-sm font-medium">{formatTime(Math.round(stats.averageTime))}</div>
              </div>
            </div>
          )}

          {/* Historique des entrées */}
          {stats.entries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Historique</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {stats.entries.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <div className="flex-1">
                      <div className="font-medium">{formatTime(entry.duration || 0)}</div>
                      {entry.description && (
                        <div className="text-gray-600 truncate">{entry.description}</div>
                      )}
                      <div className="text-gray-500">
                        {new Date(entry.startTime).toLocaleDateString('fr-FR')} à {new Date(entry.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditEntry(entry.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
