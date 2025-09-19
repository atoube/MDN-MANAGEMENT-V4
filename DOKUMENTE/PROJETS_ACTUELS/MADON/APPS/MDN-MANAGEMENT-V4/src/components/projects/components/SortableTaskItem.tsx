import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableTaskItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SortableTaskItem({ 
  id, 
  children, 
  className,
  disabled = false 
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(!disabled ? { ...attributes, ...listeners } : {})}
      className={cn(
        'group relative rounded-lg border bg-card text-card-foreground shadow-sm',
        'hover:shadow-md transition-all duration-200',
        isDragging && 'shadow-lg ring-2 ring-primary ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg" />
      )}
      {children}
    </div>
  );
} 