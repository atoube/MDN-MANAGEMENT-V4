import { RouterProvider } from 'react-router-dom';
import { createConfiguredRouter } from './config';
import { routes } from './routes';

export const Router: React.FC = () => {
  const router = createConfiguredRouter(routes);
  
  return <RouterProvider router={router} />;
}; 