import { createBrowserRouter } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

// Configurer les futures options de React Router
export const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
} as const;

// Créer une fonction pour configurer le router avec typage correct
export const createConfiguredRouter = (routes: RouteObject[]) => {
  return createBrowserRouter(routes, {
    future: routerFutureConfig
  });
}; 