import { useTransition, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spinner } from './Spinner';

export const PageTransition: React.FC = () => {
  const [isPending] = useTransition();

  return (
    <Suspense fallback={<Spinner />}>
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <Outlet />
      </div>
    </Suspense>
  );
}; 