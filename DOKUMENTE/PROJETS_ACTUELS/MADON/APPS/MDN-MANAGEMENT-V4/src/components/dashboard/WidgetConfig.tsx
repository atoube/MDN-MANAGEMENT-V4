import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Widget } from '@/types/dashboard';
import { Plus, BarChart2, PieChart, LineChart, Table } from 'lucide-react';

interface WidgetConfigProps {
  onAddWidget: (widget: Widget) => void;
}

export function WidgetConfig({ onAddWidget }: WidgetConfigProps) {
  const widgetTypes = [
    { type: 'chart', title: 'Graphique', icon: <BarChart2 className="h-4 w-4" /> },
    { type: 'pie', title: 'Camembert', icon: <PieChart className="h-4 w-4" /> },
    { type: 'line', title: 'Courbe', icon: <LineChart className="h-4 w-4" /> },
    { type: 'table', title: 'Tableau', icon: <Table className="h-4 w-4" /> },
  ];

  const handleAddWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `Nouveau ${type}`,
      position: 0,
      size: 'medium',
      config: {}
    };
    onAddWidget(newWidget);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Ajouter un widget
        </CardTitle>
        <Plus className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {widgetTypes.map(widget => (
            <Button
              key={widget.type}
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => handleAddWidget(widget.type as Widget['type'])}
            >
              {widget.icon}
              <span>{widget.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 