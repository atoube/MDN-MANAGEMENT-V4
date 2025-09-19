import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, UserPlus, Users, UserCheck, UserX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../hooks/useEmployees';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  position?: string;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateUserData {
  email: string;
  name: string;
  role: string;
  password: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { employees, loading: employeesLoading } = useEmployees();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    email: '',
    name: '',
    role: 'employee',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Vérifier si l'utilisateur est admin
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Accès Refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Récupérer la liste des utilisateurs
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Erreur lors de la récupération des utilisateurs');
      } catch (error) {
        console.error('Erreur API, utilisation des données mockées');
        // Données mockées pour le développement - 14 utilisateurs transformés en employés (NETTOYÉES)
        return [
          // Administrateurs
          {
            id: '1',
            email: 'a.dipita@themadon.com',
            name: 'Ahmadou Dipita',
            role: 'admin',
            first_name: 'Ahmadou',
            last_name: 'Dipita',
            department: 'Informatique',
            position: 'Administrateur Principal',
            must_change_password: false,
            created_at: '2023-03-01T09:00:00Z',
            updated_at: '2024-03-01T14:30:00Z'
          },
          {
            id: '2',
            email: 'admin@madon.com',
            name: 'Admin System',
            role: 'admin',
            first_name: 'Admin',
            last_name: 'System',
            department: 'Informatique',
            position: 'Administrateur Système',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T14:30:00Z'
          },
          // RH
          {
            id: '3',
            email: 'fatou.ndiaye@madon.cm',
            name: 'Fatou Ndiaye',
            role: 'hr',
            first_name: 'Fatou',
            last_name: 'Ndiaye',
            department: 'Ressources Humaines',
            position: 'Chef RH',
            must_change_password: true,
            created_at: '2021-08-20T09:00:00Z',
            updated_at: '2024-03-01T16:45:00Z'
          },
          {
            id: '4',
            email: 'hr@madon.com',
            name: 'Manager RH',
            role: 'hr',
            first_name: 'Manager',
            last_name: 'RH',
            department: 'Ressources Humaines',
            position: 'Manager RH',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T16:45:00Z'
          },
          // Managers
          {
            id: '5',
            email: 'kouassi.mensah@madon.cm',
            name: 'Kouassi Mensah',
            role: 'manager',
            first_name: 'Kouassi',
            last_name: 'Mensah',
            department: 'Ventes',
            position: 'Manager Ventes',
            must_change_password: true,
            created_at: '2023-01-10T08:30:00Z',
            updated_at: '2024-03-01T12:15:00Z'
          },
          {
            id: '6',
            email: 'sales@madon.com',
            name: 'Directeur Commercial',
            role: 'manager',
            first_name: 'Directeur',
            last_name: 'Commercial',
            department: 'Ventes',
            position: 'Directeur Commercial',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T12:15:00Z'
          },
          // Employés - Livraison
          {
            id: '7',
            email: 'aissatou.diallo@madon.cm',
            name: 'Aissatou Diallo',
            role: 'employee',
            first_name: 'Aissatou',
            last_name: 'Diallo',
            department: 'Logistique',
            position: 'Responsable Livraison',
            must_change_password: true,
            created_at: '2022-11-05T14:00:00Z',
            updated_at: '2024-03-01T11:20:00Z'
          },
          {
            id: '8',
            email: 'delivery@madon.com',
            name: 'Responsable Livraisons',
            role: 'employee',
            first_name: 'Responsable',
            last_name: 'Livraisons',
            department: 'Logistique',
            position: 'Responsable Livraisons',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T11:20:00Z'
          },
          // Employés - Stock
          {
            id: '9',
            email: 'moussa.traore@madon.cm',
            name: 'Moussa Traoré',
            role: 'employee',
            first_name: 'Moussa',
            last_name: 'Traoré',
            department: 'Support',
            position: 'Technicien Support',
            must_change_password: true,
            created_at: '2023-06-12T11:00:00Z',
            updated_at: '2024-03-01T13:45:00Z'
          },
          {
            id: '10',
            email: 'stock@madon.com',
            name: 'Gestionnaire Stock',
            role: 'employee',
            first_name: 'Gestionnaire',
            last_name: 'Stock',
            department: 'Stock',
            position: 'Gestionnaire Stock',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T13:45:00Z'
          },
          // Employés - Marketing
          {
            id: '11',
            email: 'ahmadou.bello@madon.cm',
            name: 'Ahmadou Bello',
            role: 'employee',
            first_name: 'Ahmadou',
            last_name: 'Bello',
            department: 'Informatique',
            position: 'Développeur Senior',
            must_change_password: true,
            created_at: '2022-03-15T10:00:00Z',
            updated_at: '2024-03-01T14:30:00Z'
          },
          {
            id: '12',
            email: 'marketing@madon.com',
            name: 'Responsable Marketing',
            role: 'employee',
            first_name: 'Responsable',
            last_name: 'Marketing',
            department: 'Marketing',
            position: 'Responsable Marketing',
            must_change_password: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-01T14:30:00Z'
          },
          // Employés - Comptabilité
          {
            id: '13',
            email: 'jean.baptiste@madon.cm',
            name: 'Jean Baptiste',
            role: 'employee',
            first_name: 'Jean',
            last_name: 'Baptiste',
            department: 'Comptabilité',
            position: 'Comptable',
            must_change_password: true,
            created_at: '2022-05-10T09:00:00Z',
            updated_at: '2024-02-15T14:30:00Z'
          },
          // Employé supplémentaire
          {
            id: '14',
            email: 'marie.dupont@madon.cm',
            name: 'Marie Dupont',
            role: 'employee',
            first_name: 'Marie',
            last_name: 'Dupont',
            department: 'Administration',
            position: 'Secrétaire',
            must_change_password: true,
            created_at: '2023-09-01T09:00:00Z',
            updated_at: '2024-03-01T09:00:00Z'
          }
        ];
      }
    }
  });

  // Synchroniser les employés avec les utilisateurs
  const { employeesWithUsers, employeesWithoutUsers } = useMemo(() => {
    if (!employees || !users) {
      return { employeesWithUsers: [], employeesWithoutUsers: [] };
    }

    const userEmails = new Set(users.map((u: User) => u.email));
    
    const withUsers = employees.filter((emp: any) => userEmails.has(emp.email));
    const withoutUsers = employees.filter((emp: any) => !userEmails.has(emp.email));

    return {
      employeesWithUsers: withUsers,
      employeesWithoutUsers: withoutUsers
    };
  }, [employees, users]);

  // Mutation pour créer un utilisateur
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      try {
        const response = await fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la création de l\'utilisateur');
        }

        return await response.json();
      } catch (error) {
        console.error('Erreur API, simulation de création');
        // Simulation pour le développement
        return {
          id: Date.now().toString(),
          message: 'Utilisateur créé avec succès (simulation)',
          must_change_password: true
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateDialogOpen(false);
      setCreateUserData({ email: '', name: '', role: 'employee', password: '' });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la suppression de l\'utilisateur');
        }

        return await response.json();
      } catch (error) {
        console.error('Erreur API, simulation de suppression');
        return { message: 'Utilisateur supprimé avec succès (simulation)' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleCreateUser = () => {
    if (!createUserData.email || !createUserData.name || !createUserData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    createUserMutation.mutate(createUserData);
  };

  // Créer un utilisateur à partir d'un employé
  const handleCreateUserFromEmployee = (employee: any) => {
    const userData: CreateUserData = {
      email: employee.email,
      name: `${employee.first_name} ${employee.last_name}`,
      role: employee.role || 'employee',
      password: 'Start01!' // Mot de passe initial par défaut
    };

    createUserMutation.mutate(userData);
  };

  const handleDeleteUser = (userId: string, userName: string, userRole: string) => {
    // Empêcher la suppression de soi-même
    if (userId === user?.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    // Confirmation spéciale pour les admins
    const isAdmin = userRole === 'admin';
    const confirmMessage = isAdmin 
      ? `⚠️ ATTENTION: Vous êtes sur le point de supprimer un autre administrateur "${userName}". Cette action est irréversible et peut affecter l'accès à l'application. Êtes-vous absolument sûr ?`
      : `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`;

    if (window.confirm(confirmMessage)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'hr':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateUserData(prev => ({ ...prev, password }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des utilisateurs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Synchronisez les employés avec les comptes utilisateurs
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="utilisateur@madon.cm"
                />
              </div>
              
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select value={createUserData.role} onValueChange={(value) => setCreateUserData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employé</SelectItem>
                    <SelectItem value="hr">RH</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="password">Mot de passe initial *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={createUserData.password}
                    onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe initial"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                  >
                    Générer
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  L'utilisateur devra changer ce mot de passe lors de sa première connexion
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employés ({employees?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="synchronized" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Synchronisés ({employeesWithUsers.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Utilisateurs ({users?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tous les Employés
                </CardTitle>
                <CardDescription>
                  Liste de tous les employés de l'entreprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {employees?.map((employee: any) => {
                    const hasUser = employeesWithUsers.some((emp: any) => emp.id === employee.id);
                    return (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {employee.first_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{employee.first_name} {employee.last_name}</h4>
                            <p className="text-sm text-gray-600">{employee.email}</p>
                            <p className="text-sm text-gray-500">{employee.position} - {employee.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleBadgeColor(employee.role)}>
                            {employee.role}
                          </Badge>
                          {hasUser ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              Utilisateur créé
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleCreateUserFromEmployee(employee)}
                              disabled={createUserMutation.isPending}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Créer utilisateur
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="synchronized" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Employés avec Comptes Utilisateurs
                </CardTitle>
                <CardDescription>
                  Employés qui ont déjà un compte utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {employeesWithUsers.map((employee: any) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {employee.first_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{employee.first_name} {employee.last_name}</h4>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                          <p className="text-sm text-gray-500">{employee.position} - {employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(employee.role)}>
                          {employee.role}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Synchronisé
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-4">
            {users?.map((user: User) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        {user.first_name && user.last_name && (
                          <p className="text-sm text-gray-500">
                            {user.first_name} {user.last_name}
                          </p>
                        )}
                        {user.department && user.position && (
                          <p className="text-sm text-gray-500">
                            {user.position} - {user.department}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      
                      {user.must_change_password && (
                        <Badge variant="destructive">
                          Changement requis
                        </Badge>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name, user.role)}
                          className={user.role === 'admin' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}
                          title={user.role === 'admin' ? 'Supprimer cet administrateur' : 'Supprimer cet utilisateur'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    {user.updated_at !== user.created_at && (
                      <span> • Modifié le {new Date(user.updated_at).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
