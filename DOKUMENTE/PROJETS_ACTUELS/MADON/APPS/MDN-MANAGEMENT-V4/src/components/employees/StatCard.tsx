import { motion } from 'framer-motion';

interface StatCardProps {
  icon: 'users' | 'money' | 'clock' | 'award';
  label: string;
  value: string | number;
}

export const StatCard = ({ icon, label, value }: StatCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'money':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'award':
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBgColor = () => {
    switch (icon) {
      case 'users': return 'bg-blue-100';
      case 'money': return 'bg-green-100';
      case 'clock': return 'bg-yellow-100';
      case 'award': return 'bg-purple-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`${getBgColor()} p-2 rounded-full transition-all duration-300 hover:scale-110`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}; 