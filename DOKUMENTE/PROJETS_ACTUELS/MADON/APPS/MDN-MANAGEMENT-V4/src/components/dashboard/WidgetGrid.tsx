import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";;
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { Widget } from '@/types/dashboard';

interface WidgetGridProps {
  widgets: Widget[];
  onAddWidget: (widget: Widget) => void;
  onRemoveWidget: (widgetId: string) => void;
}

export function WidgetGrid({ widgets, onAddWidget, onRemoveWidget }: WidgetGridProps) {
  const getWidgetSizeClass = (size: Widget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map(widget => (
        <Card key={widget.id} className={getWidgetSizeClass(widget.size)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {widget.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveWidget(widget.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Le contenu du widget sera rendu en fonction de son type */}
            {widget.type === 'chart' && (
              <div className="h-64">
                {/* Intégrer un graphique ici */}
              </div>
            )}
            {widget.type === 'calendar' && (
              <div className="h-64">
                {/* Intégrer un calendrier ici */}
              </div>
            )}
            {widget.type === 'notifications' && (
              <div className="h-64">
                {/* Intégrer les notifications ici */}
              </div>
            )}
            {widget.type === 'reports' && (
              <div className="h-64">
                {/* Intégrer les rapports ici */}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 