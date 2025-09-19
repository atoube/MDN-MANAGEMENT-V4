import { FC } from 'react';
import { Employee } from '../../types';

interface ExportButtonProps {
  employees: Employee[];
  onExportSuccess?: () => void;
  onExportError?: () => void;
}

export const ExportButton: FC<ExportButtonProps> = ({ 
  employees, 
  onExportSuccess, 
  onExportError 
}) => {
  const handleExport = () => {
    try {
      // Logique d'export
      const data = employees.map(emp => ({
        'Prénom': emp.first_name,
        'Nom': emp.last_name,
        'Email': emp.email,
        'Téléphone': emp.phone,
        'Poste': emp.position,
        'Salaire': emp.salary,
        'Date d\'entrée': emp.hire_date,
        'Statut': emp.status
      }));

      // Créer le CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(obj => Object.values(obj).join(','));
      const csv = [headers, ...rows].join('\n');

      // Télécharger le fichier
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      onExportSuccess?.();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      onExportError?.();
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Exporter
    </button>
  );
}; 