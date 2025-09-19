import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type Permission = 
  | 'read:employees'
  | 'write:employees'
  | 'delete:employees'
  | 'read:projects'
  | 'write:projects'
  | 'delete:projects'
  | 'read:finance'
  | 'write:finance'
  | 'read:reports'
  | 'write:reports'
  | 'admin:all'
  | 'hr:all'
  | 'manager:all';

export type Role = 'admin' | 'hr' | 'manager' | 'employee' | 'delivery' | 'seller' | 'marketing';

interface RolePermissions {
  [key in Role]: Permission[];
}

const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'admin:all',
    'read:employees', 'write:employees', 'delete:employees',
    'read:projects', 'write:projects', 'delete:projects',
    'read:finance', 'write:finance',
    'read:reports', 'write:reports'
  ],
  hr: [
    'hr:all',
    'read:employees', 'write:employees',
    'read:reports'
  ],
  manager: [
    'manager:all',
    'read:employees',
    'read:projects', 'write:projects',
    'read:reports'
  ],
  employee: [
    'read:employees',
    'read:projects'
  ],
  delivery: [
    'read:employees',
    'read:projects'
  ],
  seller: [
    'read:employees',
    'read:projects',
    'read:reports'
  ],
  marketing: [
    'read:employees',
    'read:projects',
    'read:reports'
  ]
};

export const usePermissions = () => {
  const { user } = useAuth();

  const userRole = useMemo(() => {
    if (!user) return 'employee';
    return user.role as Role;
  }, [user]);

  const userPermissions = useMemo(() => {
    if (!userRole) return [];
    return ROLE_PERMISSIONS[userRole] || [];
  }, [userRole]);

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission: Permission): boolean => {
    if (!userPermissions.length) return false;
    
    // Admin a toutes les permissions
    if (userPermissions.includes('admin:all')) return true;
    
    // Vérifier les permissions spécifiques
    return userPermissions.includes(permission);
  };

  // Vérifier si l'utilisateur a au moins une des permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Vérifier si l'utilisateur a toutes les permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Vérifier si l'utilisateur peut accéder à un module
  const canAccessModule = (moduleName: string): boolean => {
    const modulePermissions: { [key: string]: Permission[] } = {
      'employees': ['read:employees'],
      'projects': ['read:projects'],
      'finance': ['read:finance'],
      'reports': ['read:reports'],
      'settings': ['admin:all', 'hr:all']
    };

    const requiredPermissions = modulePermissions[moduleName];
    if (!requiredPermissions) return true; // Pas de restriction

    return hasAnyPermission(requiredPermissions);
  };

  // Vérifier si l'utilisateur peut modifier des données
  const canModify = (resourceType: string): boolean => {
    const modifyPermissions: { [key: string]: Permission } = {
      'employees': 'write:employees',
      'projects': 'write:projects',
      'finance': 'write:finance',
      'reports': 'write:reports'
    };

    const requiredPermission = modifyPermissions[resourceType];
    if (!requiredPermission) return false;

    return hasPermission(requiredPermission);
  };

  // Vérifier si l'utilisateur peut supprimer des données
  const canDelete = (resourceType: string): boolean => {
    const deletePermissions: { [key: string]: Permission } = {
      'employees': 'delete:employees',
      'projects': 'delete:projects'
    };

    const requiredPermission = deletePermissions[resourceType];
    if (!requiredPermission) return false;

    return hasPermission(requiredPermission);
  };

  return {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
    canModify,
    canDelete,
    isAdmin: userRole === 'admin',
    isHR: userRole === 'hr',
    isManager: userRole === 'manager'
  };
};






