import { FC, useState } from 'react';
import { Employee } from '../../types';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { createEmployeeTemplate } from '../../utils/createEmployeeTemplate';
import { Dialog } from '@headlessui/react';

interface FileHandlersProps {
  employees: Employee[];
  onImport: (data: Employee[]) => Promise<void>;
}

interface ValidationError {
  row: number;
  errors: string[];
}

interface ImportPreviewData {
  data: Partial<Employee>[];
  duplicates: number[];
}

interface ImportStats {
  total: number;
  valid: number;
  duplicates: number;
  errors: number;
}

interface LogEntry {
  timestamp: Date;
  action: 'import' | 'export';
  format: 'csv' | 'excel';
  status: 'success' | 'error';
  details: string;
}

const PreviewTable: FC<{ data: ImportPreviewData }> = ({ data }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Aperçu de l'import</h3>
      <div className="max-h-60 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((emp, index) => (
              <tr 
                key={index}
                className={data.duplicates.includes(index + 2) ? 'bg-red-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">{emp.first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.last_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    data.duplicates.includes(index + 2) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {data.duplicates.includes(index + 2) ? 'Doublon' : 'Valide'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditRow(index)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ImportStats: FC<{ stats: ImportStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Valides</p>
        <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Doublons</p>
        <p className="text-2xl font-bold text-red-600">{stats.duplicates}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Erreurs</p>
        <p className="text-2xl font-bold text-yellow-600">{stats.errors}</p>
      </div>
    </div>
  );
};

const ActivityLog: FC<{ logs: LogEntry[] }> = ({ logs }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Journal d'activité</h3>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`p-2 rounded ${
              log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <p className="text-sm">
              <span className="font-medium">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              {' - '}
              {log.action === 'import' ? 'Import' : 'Export'} {log.format.toUpperCase()}
              {' - '}
              <span className={log.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                {log.status === 'success' ? 'Succès' : 'Erreur'}
              </span>
            </p>
            <p className="text-xs text-gray-500">{log.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FileHandlers: FC<FileHandlersProps> = ({ employees, onImport }) => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<ImportStats>({
    total: 0,
    valid: 0,
    duplicates: 0,
    errors: 0
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+?[0-9]{8,}$/.test(phone);
  };

  const validateEmployee = (emp: Partial<Employee>, existingEmails: Set<string>): string[] => {
    const errors: string[] = [];
    
    // Validations basiques
    if (!emp.first_name?.trim()) errors.push('Prénom manquant');
    if (!emp.last_name?.trim()) errors.push('Nom manquant');
    if (!emp.email?.trim()) errors.push('Email manquant');
    if (!emp.position?.trim()) errors.push('Poste manquant');
    if (!emp.department?.trim()) errors.push('Département manquant');
    if (!emp.hire_date) errors.push('Date d\'entrée manquante');
    if (!emp.salary) errors.push('Salaire manquant');

    // Validations de format
    if (emp.email && !validateEmail(emp.email)) {
      errors.push('Format d\'email invalide');
    }
    if (emp.phone && !validatePhone(emp.phone)) {
      errors.push('Format de téléphone invalide');
    }
    if (emp.salary && (isNaN(Number(emp.salary)) || Number(emp.salary) <= 0)) {
      errors.push('Salaire invalide');
    }

    // Vérification des doublons
    if (emp.email && existingEmails.has(emp.email.toLowerCase())) {
      errors.push('Email déjà utilisé');
    }

    return errors;
  };

  const handleExportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Poste', 'Salaire', 'Date d\'entrée', 'Statut'];
    const csvData = employees.map(emp => [
      emp.first_name,
      emp.last_name,
      emp.email,
      emp.phone,
      emp.position,
      emp.salary,
      new Date(emp.hire_date).toLocaleDateString(),
      emp.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(employees.map(emp => ({
      'Prénom': emp.first_name,
      'Nom': emp.last_name,
      'Email': emp.email,
      'Téléphone': emp.phone,
      'Poste': emp.position,
      'Salaire': emp.salary,
      'Date d\'entrée': new Date(emp.hire_date).toLocaleDateString(),
      'Statut': emp.status
    })));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employés');
    XLSX.writeFile(workbook, `employees_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const workbook = createEmployeeTemplate();
    XLSX.writeFile(workbook, 'modele_employes.xlsx');
  };

  const logActivity = (entry: Omit<LogEntry, 'timestamp'>) => {
    setLogs(prev => [{
      ...entry,
      timestamp: new Date()
    }, ...prev]);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        if (!data) return;

        let employeesToImport: Partial<Employee>[] = [];
        const existingEmails = new Set(employees.map(e => e.email.toLowerCase()));

        if (file.name.endsWith('.csv')) {
          const rows = data.split('\n').map(row => row.split(','));
          employeesToImport = rows.slice(1).map(row => ({
            first_name: row[0]?.trim(),
            last_name: row[1]?.trim(),
            email: row[2]?.trim(),
            phone: row[3]?.trim(),
            position: row[4]?.trim(),
            department: row[5]?.trim(),
            salary: parseFloat(row[6] || '0'),
            hire_date: row[7]?.trim(),
            status: row[8]?.trim() as 'actif' | 'inactif'
          }));
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          employeesToImport = XLSX.utils.sheet_to_json(worksheet);
        }

        // Validation et détection des doublons
        const errors: ValidationError[] = [];
        const duplicates: number[] = [];
        
        employeesToImport.forEach((emp, index) => {
          const rowErrors = validateEmployee(emp, existingEmails);
          if (rowErrors.length > 0) {
            errors.push({ row: index + 2, errors: rowErrors });
          }
          if (emp.email && existingEmails.has(emp.email.toLowerCase())) {
            duplicates.push(index + 2);
          }
        });

        // Afficher l'aperçu
        setPreviewData({
          data: employeesToImport,
          duplicates
        });

        if (errors.length > 0) {
          const errorReport = errors.map(e => 
            `Ligne ${e.row}: ${e.errors.join(', ')}`
          ).join('\n');
          
          const blob = new Blob([errorReport], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'erreurs_import.txt';
          link.click();

          throw new Error(`${errors.length} erreurs trouvées. Téléchargement du rapport.`);
        }

        // Import avec barre de progression
        const validEmployees = employeesToImport.filter((emp, index) => 
          !duplicates.includes(index + 2) && validateEmployee(emp, existingEmails).length === 0
        );

        for (let i = 0; i < validEmployees.length; i++) {
          await onImport([validEmployees[i] as Employee]);
          setProgress(((i + 1) / validEmployees.length) * 100);
        }

        setStats({
          total: employeesToImport.length,
          valid: validEmployees.length,
          duplicates: duplicates.length,
          errors: errors.length
        });

        logActivity({
          action: 'import',
          format: file.name.endsWith('.csv') ? 'csv' : 'excel',
          status: 'success',
          details: `${validEmployees.length} employés importés avec succès`
        });

        toast.success(`Import réussi : ${validEmployees.length} employés importés`);
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'import du fichier');
        logActivity({
          action: 'import',
          format: file.name.endsWith('.csv') ? 'csv' : 'excel',
          status: 'error',
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      } finally {
        setImporting(false);
        setProgress(0);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Excel
        </button>
        <a
          href="/modeles/modele_employes.xlsx"
          download
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Télécharger le modèle
        </a>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Importer
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleImport}
            className="hidden"
            disabled={importing}
          />
        </label>
      </div>
      
      {stats.total > 0 && <ImportStats stats={stats} />}
      
      {previewData && <PreviewTable data={previewData} />}
      
      {importing && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <ActivityLog logs={logs} />
    </div>
  );
}; 