export function formatDate(date: string | undefined | null): string {
  if (!date) return 'Non défini';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch (error) {
    return 'Date invalide';
  }
} 