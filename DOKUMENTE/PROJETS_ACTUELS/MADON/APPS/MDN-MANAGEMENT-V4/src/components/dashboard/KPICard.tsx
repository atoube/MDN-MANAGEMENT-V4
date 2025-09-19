import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";;
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { KPI } from '@/types/dashboard';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {kpi.title}
        </CardTitle>
        {getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value} {kpi.unit}</div>
        <p className={`text-xs ${getTrendColor()}`}>
          {kpi.change > 0 ? '+' : ''}{kpi.change}% par rapport à la période précédente
        </p>
      </CardContent>
    </Card>
  );
} 