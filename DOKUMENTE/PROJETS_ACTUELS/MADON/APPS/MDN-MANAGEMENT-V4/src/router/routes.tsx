import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageTransition } from '../components/common/PageTransition';
import { Spinner } from '../components/common/Spinner';

// Importation avec typage correct
const Layout = lazy(() => import('../layouts/Layout').then(module => ({ 
  default: module.default as React.ComponentType 
})));

const FinanceLayout = lazy(() => import('../layouts/FinanceLayout').then(module => ({ 
  default: module.default as React.ComponentType 
})));

// Wrapper pour les composants lazy
const LazyWrapper: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PageTransition />,
    children: [
      {
        element: <LazyWrapper component={Layout} />,
        children: [
          {
            path: 'finance',
            element: <LazyWrapper component={FinanceLayout} />,
            children: [
              // ... autres routes
            ]
          }
          // ... autres routes
        ]
      }
    ]
  }
]; 