import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface SessionWarningProps {
  isVisible: boolean;
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionWarning: React.FC<SessionWarningProps> = ({
  isVisible,
  timeRemaining,
  onExtend,
  onLogout
}) => {
  if (!isVisible) return null;

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Session expirera bientôt
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-amber-700">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <p className="mt-2 text-sm text-amber-700">
              Votre session expire dans quelques minutes. Cliquez sur "Prolonger" pour rester connecté.
            </p>
            <div className="mt-4 flex space-x-2">
              <Button
                onClick={onExtend}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Prolonger
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};






