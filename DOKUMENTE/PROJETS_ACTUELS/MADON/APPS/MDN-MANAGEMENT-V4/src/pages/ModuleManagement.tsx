import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { useModules } from '../hooks/useModules';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings, Loader2 } from 'lucide-react';
import type { Module } from '../lib/database.types';

interface SortableModuleItemProps {
  module: Module;
  onToggle: (enabled: boolean) => Promise<void>;
  isUpdating?: boolean;
}

const moduleCategories = {
  core: { name: 'Modules Principaux', color: 'bg-blue-100 text-blue-600' },
  hr: { name: 'Ressources Humaines', color: 'bg-green-100 text-green-600' },
  finance: { name: 'Finance', color: 'bg-purple-100 text-purple-600' },
  marketing: { name: 'Marketing', color: 'bg-yellow-100 text-yellow-600' },
  operations: { name: 'Opérations', color: 'bg-red-100 text-red-600' }
};

const moduleDescriptions: Record<string, string> = {
  projects: 'Gérez vos projets, tâches et équipes en un seul endroit.',
  employees: 'Suivez les informations des employés, leurs congés et performances.',
  documents: 'Stockez et gérez tous vos documents importants de manière sécurisée.',
  dashboard: 'Visualisez les KPIs et statistiques importantes de votre entreprise.',
  calendar: 'Planifiez et suivez les événements, réunions et échéances.',
  deliveries: 'Gérez vos livraisons et expéditions de manière efficace.',
  finance: 'Suivez vos finances, factures et budgets en temps réel.',
  sales: 'Gérez vos ventes, clients et opportunités commerciales.'
};

function SortableModuleItem({ module, onToggle, isUpdating }: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = async (newEnabled: boolean) => {
    try {
      await onToggle(newEnabled);
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  const category = moduleCategories[module.category as keyof typeof moduleCategories] || 
                  { name: 'Autre', color: 'bg-gray-100 text-gray-600' };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-lg shadow mb-2 ${
        isDragging ? 'shadow-lg' : ''
      } ${!module.enabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            className={`p-2 rounded touch-none ${
              module.enabled ? 'cursor-grab hover:bg-gray-100' : 'cursor-not-allowed'
            }`}
            {...attributes}
            {...listeners}
            disabled={!module.enabled}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>
          <div className="ml-3">
            <div className="flex items-center">
              <span className={`font-medium ${!module.enabled ? 'text-gray-500' : ''}`}>
                {module.name}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${category.color} ${
                !module.enabled ? 'opacity-50' : ''
              }`}>
                {category.name}
              </span>
            </div>
            <p className={`text-sm text-gray-500 mt-1 ${
              !module.enabled ? 'opacity-50' : ''
            }`}>
              {moduleDescriptions[module.id] || 'Aucune description disponible'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {isUpdating && (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 mr-2" />
          )}
          <Switch
            checked={module.enabled}
            onChange={handleToggle}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}

export function ModuleManagement() {
  const { modules, isLoading, updateModuleOrder, toggleModule } = useModules();
  const [updatingModules, setUpdatingModules] = React.useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && modules) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over?.id);

      const newModules = arrayMove(modules, oldIndex, newIndex);
      updateModuleOrder.mutate(newModules);
    }
  };

  const handleToggleModule = async (moduleId: string, newEnabled: boolean) => {
    setUpdatingModules(prev => {
      const next = new Set(prev);
      next.add(moduleId);
      return next;
    });
    try {
      await toggleModule.mutateAsync({ id: moduleId, enabled: newEnabled });
    } finally {
      setUpdatingModules(prev => {
        const next = new Set(prev);
        next.delete(moduleId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des modules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Activez, désactivez et réorganisez les modules de l'application
          </p>
        </div>
        <Button variant="secondary">
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={modules?.map(m => m.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {modules?.map((module) => (
                <SortableModuleItem
                  key={module.id}
                  module={module}
                  isUpdating={updatingModules.has(module.id)}
                  onToggle={(enabled) => handleToggleModule(module.id, enabled)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </Card>
    </div>
  );
}