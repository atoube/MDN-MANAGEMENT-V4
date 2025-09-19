import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageSync } from './components/LanguageSync';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
            <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <SettingsProvider>
                <LanguageProvider>
                  <NotificationProvider>
                    <LanguageSync />
                    <App />
                    <Toaster position="top-right" />
                  </NotificationProvider>
                </LanguageProvider>
              </SettingsProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
  </React.StrictMode>
);
