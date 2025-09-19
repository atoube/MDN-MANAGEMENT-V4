import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingScreen({ 
  message = 'Chargement...', 
  size = 'md',
  fullScreen = false 
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 
          className={`${sizeClasses[size]} animate-spin text-indigo-600 mx-auto mb-4`}
          aria-hidden="true"
        />
        <p className="text-gray-600 text-sm" aria-live="polite">
          {message}
        </p>
      </div>
    </div>
  );
} 