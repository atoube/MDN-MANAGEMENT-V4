import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({
  title,
  description,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white overflow-hidden shadow rounded-lg',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="px-4 py-5 sm:px-6">
          {title && (
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}