import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Store,
  ClipboardList,
  LogOut,
  Bell,
  Share2,
  DollarSign,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useModules } from '../hooks/useModules';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { modules } = useModules();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isAdmin = user?.email === 'admin@example.com'; // Simplified admin check

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">MADON Marketplace</h1>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {modules?.filter(m => m.enabled).map((module) => {
                  const Icon = {
                    LayoutDashboard,
                    Users,
                    Truck,
                    Package,
                    Store,
                    ClipboardList,
                    Share2,
                    DollarSign
                  }[module.icon as keyof typeof Icons] || LayoutDashboard;

                  return (
                    <Link
                      key={module.id}
                      to={module.path}
                      className={cn(
                        location.pathname === module.path
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <Icon
                        className={cn(
                          location.pathname === module.path
                            ? 'text-indigo-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 h-5 w-5'
                        )}
                      />
                      {module.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4 flex-col space-y-2">
              <Link
                to="/module-management"
                className={cn(
                  location.pathname === '/module-management'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <Settings className={cn(
                  location.pathname === '/module-management'
                    ? 'text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-5 w-5'
                )} />
                Configuration
              </Link>
              <button
                onClick={handleSignOut}
                className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <div className="flex-1 px-4 flex justify-end">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-sm font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}