import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Plus,
  UsersRound,
  Loader2
} from 'lucide-react';
import { useRecipients } from '../hooks/useRecipients';
import { useAuth } from '../contexts/AuthContext';

export function Recipients() {
  const { user } = useAuth();
  const {
    recipients,
    groups,
    isLoading,
    createRecipient,
    createGroup,
    addToGroup,
    removeFromGroup
  } = useRecipients();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const filteredRecipients = selectedGroup === 'all'
    ? recipients
    : recipients?.filter(recipient =>
        groups?.find(g => g.id === selectedGroup)?.recipient_group_members
          .some(m => m.recipient_id === recipient.id)
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Destinataires</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos listes de diffusion et groupes de destinataires
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <UsersRound className="w-4 h-4 mr-2" />
            Nouveau groupe
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Nouveau destinataire
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {recipients?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UsersRound className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Groupes</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {groups?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Taux d'ouverture</h3>
              <p className="text-3xl font-semibold text-gray-900">32%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Actifs</h3>
              <p className="text-3xl font-semibold text-gray-900">78%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Groupes</h3>
                <Button size="sm" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedGroup('all')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedGroup === 'all'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tous les destinataires
                  <span className="float-right text-sm text-gray-500">
                    {recipients?.length || 0}
                  </span>
                </button>

                {groups?.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedGroup === group.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {group.name}
                    <span className="float-right text-sm text-gray-500">
                      {group.recipient_group_members.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    className="pl-10"
                    placeholder="Rechercher un destinataire..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            <Table
              headers={[
                'Destinataire',
                'Email',
                'Groupes',
                'Date d\'ajout',
                'Actions'
              ]}
            >
              {filteredRecipients?.map((recipient) => (
                <tr key={recipient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {`${recipient.first_name[0]}${recipient.last_name[0]}`}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {`${recipient.first_name} ${recipient.last_name}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipient.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {groups?.filter(group =>
                        group.recipient_group_members.some(m => m.recipient_id === recipient.id)
                      ).map(group => (
                        <Badge key={group.id} variant="info">
                          {group.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(recipient.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" size="sm">
                        Modifier
                      </Button>
                      <Button variant="danger" size="sm">
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}