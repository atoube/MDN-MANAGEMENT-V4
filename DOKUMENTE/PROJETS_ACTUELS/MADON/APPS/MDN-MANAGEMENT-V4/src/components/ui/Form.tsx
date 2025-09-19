import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(
          'space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg',
          className
        )}
        {...props}
      />
    );
  }
);
Form.displayName = 'Form';

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('space-y-2', className)}
      {...props}
    />
  );
});
FormField.displayName = 'FormField';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        'text-sm font-medium text-gray-700 dark:text-gray-200',
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm font-medium text-red-500 dark:text-red-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormLabel, FormMessage }; 