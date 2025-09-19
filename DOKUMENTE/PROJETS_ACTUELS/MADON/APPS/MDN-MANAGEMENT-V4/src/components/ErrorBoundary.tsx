import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oups ! Quelque chose s'est mal passé
            </h2>
            
            <p className="text-gray-600 mb-6">
              Une erreur inattendue s'est produite. Veuillez réessayer ou retourner à l'accueil.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Détails de l'erreur (développement)
                </summary>
                <div className="bg-gray-100 p-4 rounded-md text-xs font-mono text-gray-800 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Erreur:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                className="w-full"
                variant="ghost"
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Si le problème persiste, contactez l'administrateur.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 