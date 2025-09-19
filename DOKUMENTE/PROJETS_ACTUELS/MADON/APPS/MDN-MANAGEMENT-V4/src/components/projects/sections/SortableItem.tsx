import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
    scale: isDragging ? 1.05 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        'group relative rounded-lg border bg-card text-card-foreground shadow-sm',
        'hover:shadow-md transition-all duration-200',
        isDragging && 'shadow-lg ring-2 ring-primary ring-offset-2',
        over && 'ring-2 ring-primary/50',
        className
      )}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg" />
      )}
      {over && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 