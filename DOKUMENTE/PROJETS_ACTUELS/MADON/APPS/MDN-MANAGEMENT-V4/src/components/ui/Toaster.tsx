import * as React from 'react';
import { Toast, ToastTitle, ToastDescription } from './Toast';
import { useToast } from './useToast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
          </Toast>
        );
      })}
    </div>
  );
} 