import React from 'react';
import { Outlet } from 'react-router-dom';

const FinanceLayout: React.FC = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default FinanceLayout; 