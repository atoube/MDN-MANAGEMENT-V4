import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface AuditLog {
  id: string;
  userId: number;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string | number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  success: boolean;
  errorMessage?: string;
}

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'access_denied'
  | 'permission_error';

export type AuditResource = 
  | 'employee'
  | 'project'
  | 'finance'
  | 'report'
  | 'user'
  | 'session'
  | 'system';

export const useAudit = () => {
  const { user } = useAuth();

  // Obtenir l'adresse IP (simulation en développement)
  const getClientIP = (): string => {
    // En production, cela viendrait du serveur
    return '127.0.0.1';
  };

  // Obtenir l'agent utilisateur
  const getUserAgent = (): string => {
    return navigator.userAgent;
  };

  // Créer un log d'audit
  const logAction = useCallback((
    action: AuditAction,
    resource: AuditResource,
    resourceId?: string | number,
    details?: any,
    success: boolean = true,
    errorMessage?: string
  ) => {
    if (!user) return;

    const auditLog: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userEmail: user.email,
      action,
      resource,
      resourceId,
      details,
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
      timestamp: Date.now(),
      success,
      errorMessage
    };

    // Sauvegarder dans localStorage (en production, ceci irait à une API)
    const existingLogs = localStorage.getItem('auditLogs');
    const logs: AuditLog[] = existingLogs ? JSON.parse(existingLogs) : [];
    
    // Garder seulement les 1000 derniers logs
    if (logs.length >= 1000) {
      logs.splice(0, logs.length - 999);
    }
    
    logs.push(auditLog);
    localStorage.setItem('auditLogs', JSON.stringify(logs));

    // En production, envoyer à l'API d'audit
    console.log('🔍 Audit Log:', auditLog);
  }, [user]);

  // Log de connexion
  const logLogin = useCallback((success: boolean, errorMessage?: string) => {
    logAction('login', 'session', undefined, { method: 'password' }, success, errorMessage);
  }, [logAction]);

  // Log de déconnexion
  const logLogout = useCallback(() => {
    logAction('logout', 'session');
  }, [logAction]);

  // Log d'accès à une ressource
  const logAccess = useCallback((
    resource: AuditResource,
    resourceId?: string | number,
    success: boolean = true
  ) => {
    logAction('read', resource, resourceId, undefined, success);
  }, [logAction]);

  // Log de création
  const logCreate = useCallback((
    resource: AuditResource,
    resourceId: string | number,
    details?: any
  ) => {
    logAction('create', resource, resourceId, details, true);
  }, [logAction]);

  // Log de modification
  const logUpdate = useCallback((
    resource: AuditResource,
    resourceId: string | number,
    details?: any
  ) => {
    logAction('update', resource, resourceId, details, true);
  }, [logAction]);

  // Log de suppression
  const logDelete = useCallback((
    resource: AuditResource,
    resourceId: string | number
  ) => {
    logAction('delete', resource, resourceId, undefined, true);
  }, [logAction]);

  // Log d'accès refusé
  const logAccessDenied = useCallback((
    resource: AuditResource,
    resourceId?: string | number,
    reason?: string
  ) => {
    logAction('access_denied', resource, resourceId, { reason }, false, 'Permission denied');
  }, [logAction]);

  // Log d'erreur de permission
  const logPermissionError = useCallback((
    resource: AuditResource,
    action: string,
    reason?: string
  ) => {
    logAction('permission_error', resource, undefined, { attemptedAction: action, reason }, false, 'Insufficient permissions');
  }, [logAction]);

  // Obtenir les logs d'audit
  const getAuditLogs = useCallback((
    filters?: {
      userId?: number;
      action?: AuditAction;
      resource?: AuditResource;
      startDate?: number;
      endDate?: number;
      limit?: number;
    }
  ): AuditLog[] => {
    const existingLogs = localStorage.getItem('auditLogs');
    if (!existingLogs) return [];

    let logs: AuditLog[] = JSON.parse(existingLogs);

    // Appliquer les filtres
    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    if (filters?.resource) {
      logs = logs.filter(log => log.resource === filters.resource);
    }
    if (filters?.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!);
    }

    // Trier par timestamp décroissant (plus récent en premier)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    // Limiter le nombre de résultats
    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }, []);

  // Obtenir les statistiques d'audit
  const getAuditStats = useCallback(() => {
    const logs = getAuditLogs();
    
    const stats = {
      totalActions: logs.length,
      successfulActions: logs.filter(log => log.success).length,
      failedActions: logs.filter(log => !log.success).length,
      actionsByType: {} as Record<AuditAction, number>,
      resourcesByType: {} as Record<AuditResource, number>,
      usersByActivity: {} as Record<number, number>,
      recentActivity: logs.slice(0, 10) // 10 dernières actions
    };

    // Compter les actions par type
    logs.forEach(log => {
      stats.actionsByType[log.action] = (stats.actionsByType[log.action] || 0) + 1;
      stats.resourcesByType[log.resource] = (stats.resourcesByType[log.resource] || 0) + 1;
      stats.usersByActivity[log.userId] = (stats.usersByActivity[log.userId] || 0) + 1;
    });

    return stats;
  }, [getAuditLogs]);

  return {
    logAction,
    logLogin,
    logLogout,
    logAccess,
    logCreate,
    logUpdate,
    logDelete,
    logAccessDenied,
    logPermissionError,
    getAuditLogs,
    getAuditStats
  };
};






