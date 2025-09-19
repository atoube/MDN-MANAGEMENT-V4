import { useAuth } from '../contexts/AuthContext';

export interface LeavePermissions {
  canViewAll: boolean;
  canApproveAll: boolean;
  canApproveOwn: boolean;
  canRejectAll: boolean;
  canRejectOwn: boolean;
  canCreate: boolean;
  canViewOwn: boolean;
}

export function useLeavePermissions() {
  const { user } = useAuth();

  const getPermissions = (): LeavePermissions => {
    if (!user) {
      return {
        canViewAll: false,
        canApproveAll: false,
        canApproveOwn: false,
        canRejectAll: false,
        canRejectOwn: false,
        canCreate: false,
        canViewOwn: false,
      };
    }

    const isAdmin = user.role === 'admin';
    const isHR = user.department?.toLowerCase() === 'rh' || user.department?.toLowerCase() === 'ressources humaines';
    const isEmployee = user.role === 'employee';

    return {
      // Les admins peuvent tout voir et tout faire
      canViewAll: isAdmin,
      canApproveAll: isAdmin,
      canApproveOwn: isAdmin,
      canRejectAll: isAdmin,
      canRejectOwn: isAdmin,
      canCreate: true,
      canViewOwn: true,

      // Les RH peuvent voir toutes les demandes mais ne peuvent pas valider leurs propres demandes
      ...(isHR && !isAdmin && {
        canViewAll: true,
        canApproveAll: true,
        canApproveOwn: false, // Les RH ne peuvent pas valider leurs propres demandes
        canRejectAll: true,
        canRejectOwn: false, // Les RH ne peuvent pas rejeter leurs propres demandes
        canCreate: true,
        canViewOwn: true,
      }),

      // Les employés normaux ne peuvent que voir et créer leurs propres demandes
      ...(isEmployee && !isHR && !isAdmin && {
        canViewAll: false,
        canApproveAll: false,
        canApproveOwn: false,
        canRejectAll: false,
        canRejectOwn: false,
        canCreate: true,
        canViewOwn: true,
      }),
    };
  };

  const canViewRequest = (requestEmployeeEmail: string): boolean => {
    const permissions = getPermissions();
    
    // Si on peut voir toutes les demandes
    if (permissions.canViewAll) {
      return true;
    }
    
    // Sinon, on ne peut voir que ses propres demandes
    return permissions.canViewOwn && requestEmployeeEmail === user?.email;
  };

  const canApproveRequest = (requestEmployeeEmail: string): boolean => {
    const permissions = getPermissions();
    
    // Si on peut approuver toutes les demandes
    if (permissions.canApproveAll) {
      return true;
    }
    
    // Si on peut approuver ses propres demandes
    if (permissions.canApproveOwn && requestEmployeeEmail === user?.email) {
      return true;
    }
    
    return false;
  };

  const canRejectRequest = (requestEmployeeEmail: string): boolean => {
    const permissions = getPermissions();
    
    // Si on peut rejeter toutes les demandes
    if (permissions.canRejectAll) {
      return true;
    }
    
    // Si on peut rejeter ses propres demandes
    if (permissions.canRejectOwn && requestEmployeeEmail === user?.email) {
      return true;
    }
    
    return false;
  };

  return {
    permissions: getPermissions(),
    canViewRequest,
    canApproveRequest,
    canRejectRequest,
    isAdmin: user?.role === 'admin',
    isHR: user?.department?.toLowerCase() === 'rh' || user?.department?.toLowerCase() === 'ressources humaines',
    isEmployee: user?.role === 'employee',
  };
}
