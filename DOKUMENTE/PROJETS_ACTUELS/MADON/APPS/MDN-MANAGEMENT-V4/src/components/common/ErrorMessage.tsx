import React, { ReactNode } from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  action?: ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title, 
  message, 
  action 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{title}</div>
          <p className="text-gray-600 mb-6">{message}</p>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 