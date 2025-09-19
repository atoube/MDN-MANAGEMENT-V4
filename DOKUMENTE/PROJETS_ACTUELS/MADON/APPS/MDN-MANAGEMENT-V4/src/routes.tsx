import App from './App';
import { Employees } from './components/employees/Employees';
import { PayrollManagement } from './components/finance/PayrollManagement';
// Importez vos autres composants de pages ici

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'employees',
        element: <Employees />
      },
      {
        path: 'finance/payroll',
        element: <PayrollManagement />
      },
      // Ajoutez ici vos autres routes
    ]
  }
]; 