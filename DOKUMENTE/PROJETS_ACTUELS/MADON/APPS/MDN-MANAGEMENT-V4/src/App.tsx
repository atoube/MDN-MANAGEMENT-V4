import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Deliveries } from './pages/Deliveries';
import { NewDelivery } from './pages/delivery/NewDelivery';
import { DeliveryDetails } from './pages/delivery/DeliveryDetails';
import { Employees } from './pages/Employees';
import { Sellers } from './pages/Sellers';
import { Stock } from './pages/Stock';
import { Tasks } from './pages/Tasks';
import { Marketing } from './pages/Marketing';
import { Finance } from './pages/Finance';
import { ModuleManagement } from './pages/ModuleManagement';
import { Recipients } from './pages/Recipients';
import { Campaigns } from './pages/email/Campaigns';
import { FacebookInsights } from './pages/social/FacebookInsights';
import { InstagramInsights } from './pages/social/InstagramInsights';
import { LinkedinInsights } from './pages/social/LinkedinInsights';
import { TwitterInsights } from './pages/social/TwitterInsights';
import { NewCampaign } from './pages/email/NewCampaign';
import { Accounting } from './pages/finance/Accounting';
import { Payroll } from './pages/finance/Payroll';
import { PayrollDetails } from './pages/finance/PayrollDetails';
import { NewPayroll } from './pages/finance/NewPayroll';
import { DGIDeclarations } from './pages/finance/DGIDeclarations';
import { Projects } from './pages/Projects';
import { AuthForm } from './components/AuthForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="deliveries/new" element={<NewDelivery />} />
              <Route path="deliveries/:id" element={<DeliveryDetails />} />
              <Route path="employees" element={<Employees />} />
              <Route path="sellers" element={<Sellers />} />
              <Route path="stock" element={<Stock />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="finance" element={<Finance />} />
              <Route path="finance/accounting" element={<Accounting />} />
              <Route path="finance/payroll" element={<Payroll />} />
              <Route path="finance/payroll/new" element={<NewPayroll />} />
              <Route path="finance/payroll/:id" element={<PayrollDetails />} />
              <Route path="finance/dgi" element={<DGIDeclarations />} />
              <Route path="projects" element={<Projects />} />
              <Route path="module-management" element={<ModuleManagement />} />
              <Route path="marketing/recipients" element={<Recipients />} />
              <Route path="marketing/campaigns" element={<Campaigns />} />
              <Route path="marketing/facebook" element={<FacebookInsights />} />
              <Route path="marketing/instagram" element={<InstagramInsights />} />
              <Route path="marketing/linkedin" element={<LinkedinInsights />} />
              <Route path="marketing/twitter" element={<TwitterInsights />} />
              <Route path="marketing/new-campaign" element={<NewCampaign />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;