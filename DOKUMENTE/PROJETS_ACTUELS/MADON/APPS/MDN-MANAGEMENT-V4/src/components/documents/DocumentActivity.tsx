import React from 'react';
import { DocumentActivity as DocumentActivityType } from '../../types/document';
import { formatDate } from '../../lib/dateUtils';
import { Clock, FileText, Share2, Download, Trash2, Lock, Unlock } from 'lucide-react';

interface DocumentActivityProps {
  activities: DocumentActivityType[];
}

export const DocumentActivity: React.FC<DocumentActivityProps> = ({ activities }) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'view': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'edit': return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'share': return <Share2 className="w-4 h-4 text-green-500" />;
      case 'download': return <Download className="w-4 h-4 text-purple-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'lock': return <Lock className="w-4 h-4 text-orange-500" />;
      case 'unlock': return <Unlock className="w-4 h-4 text-green-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: DocumentActivityType) => {
    const actions = {
      view: 'a consulté le document',
      edit: 'a modifié le document',
      share: 'a partagé le document',
      download: 'a téléchargé le document',
      delete: 'a supprimé le document',
      lock: 'a verrouillé le document',
      unlock: 'a déverrouillé le document'
    };
    return `${activity.user_id} ${actions[activity.action] || 'a effectué une action sur le document'}`;
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-4">Historique des activités</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getActivityIcon(activity.action)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm">{getActivityText(activity)}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(activity.created_at)}
                </div>
              </div>
              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {value}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 