import React from 'react';
import { StatCard } from './common/StatCard';
import { useGlobalStats } from '../hooks/useGlobalStats';

export const Dashboard = () => {
  const { data: stats, isLoading, error } = useGlobalStats();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const safeStats = {
    activeEmployees: stats?.activeEmployees ?? 0,
    totalEmployees: stats?.employees?.total ?? 0,
    averagePerformance: stats?.averagePerformance ?? 0,
    attendanceRate: stats?.attendanceRate ?? 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <StatCard
        title="Employés Actifs"
        value={safeStats.activeEmployees}
        trend={{
          value: ((safeStats.activeEmployees - safeStats.totalEmployees) / safeStats.totalEmployees) * 100,
          isPositive: safeStats.activeEmployees >= safeStats.totalEmployees / 2
        }}
        icon={<UserIcon />}
      />
      <StatCard
        title="Performance Moyenne"
        value={`${Math.round(safeStats.averagePerformance)}%`}
        trend={{
          value: safeStats.averagePerformance,
          isPositive: safeStats.averagePerformance >= 70
        }}
        icon={<ChartIcon />}
      />
      <StatCard
        title="Taux de Présence"
        value={`${Math.round(safeStats.attendanceRate)}%`}
        trend={{
          value: safeStats.attendanceRate,
          isPositive: safeStats.attendanceRate >= 90
        }}
        icon={<CalendarIcon />}
      />
    </div>
  );
};

// Icônes simples pour l'exemple
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
); 