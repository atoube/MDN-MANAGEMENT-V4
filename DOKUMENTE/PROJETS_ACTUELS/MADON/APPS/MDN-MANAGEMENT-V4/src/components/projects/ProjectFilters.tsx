import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ProjectStatus, ProjectPriority } from './types';
import { Search } from 'lucide-react';

interface ProjectFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: ProjectStatus | 'all') => void;
  onPriorityChange: (priority: ProjectPriority | 'all') => void;
}

export default function ProjectFilters({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleStatusChange = (value: ProjectStatus | 'all') => {
    setStatusFilter(value);
    onStatusChange(value);
  };

  const handlePriorityChange = (value: ProjectPriority | 'all') => {
    setPriorityFilter(value);
    onPriorityChange(value);
  };

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un projet..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="planning">En planification</SelectItem>
          <SelectItem value="in_progress">En cours</SelectItem>
          <SelectItem value="on_hold">En attente</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les priorités</SelectItem>
          <SelectItem value="low">Basse</SelectItem>
          <SelectItem value="medium">Moyenne</SelectItem>
          <SelectItem value="high">Haute</SelectItem>
          <SelectItem value="urgent">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 