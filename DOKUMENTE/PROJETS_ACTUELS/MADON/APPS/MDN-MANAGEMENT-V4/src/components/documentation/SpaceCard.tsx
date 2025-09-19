import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Users, FileText, Calendar, Lock, Globe } from 'lucide-react';
import { Space } from '../../types/documentation';

interface SpaceCardProps {
  space: Space;
  documentCount: number;
  onSelect: () => void;
}

export function SpaceCard({ space, documentCount, onSelect }: SpaceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: space.color }}
            >
              {space.icon || space.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">{space.name}</CardTitle>
              <p className="text-sm text-gray-500">{space.key}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {space.is_public ? (
              <Globe className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {space.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Membres</span>
            </div>
            <span className="font-medium">{space.members.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Documents</span>
            </div>
            <span className="font-medium">{documentCount}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Créé le</span>
            </div>
            <span className="font-medium">{formatDate(space.created_at)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Propriétaire: <span className="font-medium text-gray-700">{space.owner_name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onSelect}>
              Ouvrir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
