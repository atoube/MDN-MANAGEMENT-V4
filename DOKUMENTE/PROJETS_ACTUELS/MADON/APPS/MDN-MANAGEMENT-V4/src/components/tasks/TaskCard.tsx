import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  User, 
  Flag, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { TaskTimer } from './TaskTimer';
import { TagSelector } from './TagSelector';
import { CommentSection } from './CommentSection';
import { useTags } from '../../hooks/useTags';
import { useComments } from '../../hooks/useComments';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;
  showTimer?: boolean;
  showTags?: boolean;
  showComments?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, showActions = true, showTimer = false, showTags = false, showComments = false }: TaskCardProps) {
  const { getTaskTags } = useTags();
  const { getTaskComments } = useComments();
  const [taskTags, setTaskTags] = useState(getTaskTags(task.id));
  const [showCommentSection, setShowCommentSection] = useState(false);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <AlertCircle className="h-3 w-3" />;
      case 'review': return <Clock className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <XCircle className="h-3 w-3" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="h-3 w-3" />;
      case 'medium': return <Flag className="h-3 w-3" />;
      case 'low': return <Flag className="h-3 w-3" />;
      default: return <Flag className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && task.status !== 'completed';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* En-tête avec titre et statut */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
              {task.title}
            </h4>
            <Badge className={`${getStatusColor(task.status)} text-xs`}>
              {getStatusIcon(task.status)}
              <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-3">
              {task.description}
            </p>
          )}

          {/* Métadonnées */}
          <div className="space-y-2">
            {/* Priorité */}
            <div className="flex items-center gap-2">
              <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
            </div>

            {/* Assigné à */}
            {task.assigned_user && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User className="h-3 w-3" />
                <span>{task.assigned_user.first_name} {task.assigned_user.last_name}</span>
              </div>
            )}

            {/* Date d'échéance */}
            {task.due_date && (
              <div className={`flex items-center gap-2 text-xs ${
                isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.due_date)}</span>
                {isOverdue(task.due_date) && (
                  <span className="text-red-500 font-medium">(En retard)</span>
                )}
              </div>
            )}

            {/* Créé par */}
            {task.creator && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Créé par {task.creator.first_name} {task.creator.last_name}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {showTags && (
            <div className="pt-2 border-t">
              <TagSelector
                taskId={task.id}
                selectedTags={taskTags}
                onTagsChange={setTaskTags}
                compact
              />
            </div>
          )}

          {/* Timer compact */}
          {showTimer && (
            <div className="pt-2 border-t">
              <TaskTimer taskId={task.id} taskTitle={task.title} compact />
            </div>
          )}

          {/* Commentaires */}
          {showComments && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>{getTaskComments(task.id).length} commentaire{getTaskComments(task.id).length > 1 ? 's' : ''}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCommentSection(!showCommentSection)}
                  className="text-xs"
                >
                  {showCommentSection ? 'Masquer' : 'Voir'}
                </Button>
              </div>
              
              {showCommentSection && (
                <div className="mt-3">
                  <CommentSection taskId={task.id} taskTitle={task.title} compact />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="flex-1 text-xs"
                >
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Supprimer
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}