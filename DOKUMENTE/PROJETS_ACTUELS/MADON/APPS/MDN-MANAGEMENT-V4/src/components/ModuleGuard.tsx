import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useModules } from '@/hooks/useModules';
import { Loader2 } from 'lucide-react';

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleId: string;
}

export function ModuleGuard({ children, moduleId }: ModuleGuardProps) {
  const { modules, isLoading } = useModules();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const module = modules?.find(m => m.id === moduleId);
  
  if (!module?.enabled) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 