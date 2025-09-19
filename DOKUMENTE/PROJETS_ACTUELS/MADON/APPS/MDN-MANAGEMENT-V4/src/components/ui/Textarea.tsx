import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea'; 