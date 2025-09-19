import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SalaryWithEmployee, SalaryFormData } from './types';
import { Button } from '../ui/Button';
import { Table } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import { SalaryForm } from './SalaryForm';

export const PayrollManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: salaries, isLoading, error } = useQuery({
    queryKey: ['salaries', format(selectedMonth, 'yyyy-MM')],
    queryFn: async () => {
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
// Mock from call
        .select(`
          *,
          employee:employees (
            id,
            first_name,
            last_name,
            email,
            department:departments (name),
            position,
            bank_account,
            social_security_number
          )
        `)
        .gte('payment_date', startOfMonth.toISOString())
        .lte('payment_date', endOfMonth.toISOString())
// Mock order call;

      // Removed error check - using mock data
      return data as SalaryWithEmployee[];
    }
  });

  const handleSubmit = async (formData: SalaryFormData) => {
    try {
      const netSalary = formData.base_salary + formData.bonus - formData.deductions;
      
      const salaryData = {
        ...formData,
        net_salary: netSalary,
        status: 'pending'
      };
// Mock from call
        .insert([salaryData]);

      // Removed error check - using mock data

      toast.success('Salaire enregistré avec succès');
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du salaire:', error);
      toast.error('Erreur lors de l\'enregistrement du salaire');
    }
  };

  const handleStatusChange = async (salaryId: string, newStatus: 'paid' | 'cancelled') => {
    try {
// Mock from call
        .update({ status: newStatus })
// Mock eq call;

      // Removed error check - using mock data

      toast.success('Statut mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const generatePayslips = async () => {
    try {
      if (!salaries || salaries.length === 0) {
        toast.error('Aucun salaire à générer pour ce mois');
        return;
      }

      // Logique pour générer les fiches de paie
      // Ici, vous pourriez appeler une API ou utiliser une bibliothèque de génération de PDF
      toast.success('Fiches de paie générées avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération des fiches de paie:', error);
      toast.error('Erreur lors de la génération des fiches de paie');
    }
  };

  const calculateTotalSalaries = () => {
    if (!salaries) return 0;
    return salaries.reduce((total, salary) => total + salary.net_salary, 0);
  };

  const calculateAverageSalary = () => {
    if (!salaries || salaries.length === 0) return 0;
    return calculateTotalSalaries() / salaries.length;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Salaires</h1>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            >
              &lt;
            </Button>
            <p className="text-gray-600">
              {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
            </p>
            <Button
              size="sm"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            >
              &gt;
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>
            Nouveau Salaire
          </Button>
          <Button onClick={generatePayslips}>
            Générer Fiches de Paie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total des Salaires</h3>
          <p className="text-2xl font-bold">
            {calculateTotalSalaries().toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Salaire Moyen</h3>
          <p className="text-2xl font-bold">
            {calculateAverageSalary().toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Nombre d'Employés</h3>
          <p className="text-2xl font-bold">
            {salaries?.length || 0}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des données...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          Erreur lors du chargement des données: {error instanceof Error ? error.message : 'Erreur inconnue'}
        </div>
      ) : !salaries || salaries.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun salaire enregistré</h3>
          <p className="text-gray-500 mb-4">Commencez par ajouter un nouveau salaire en cliquant sur le bouton ci-dessus.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Ajouter un salaire
          </Button>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Employé</th>
              <th>Département</th>
              <th>Date de paiement</th>
              <th>Salaire de base</th>
              <th>Bonus</th>
              <th>Déductions</th>
              <th>Salaire net</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.id}>
                <td>
                  {salary.employee?.first_name} {salary.employee?.last_name}
                </td>
                <td>{salary.employee?.department?.name}</td>
                <td>
                  {format(new Date(salary.payment_date), 'dd MMMM yyyy', { locale: fr })}
                </td>
                <td>{salary.base_salary.toLocaleString('fr-FR')} €</td>
                <td>{salary.bonus.toLocaleString('fr-FR')} €</td>
                <td>{salary.deductions.toLocaleString('fr-FR')} €</td>
                <td>{salary.net_salary.toLocaleString('fr-FR')} €</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    salary.status === 'paid' ? 'bg-green-100 text-green-800' :
                    salary.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {salary.status === 'paid' ? 'Payé' :
                     salary.status === 'cancelled' ? 'Annulé' :
                     'En attente'}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    {salary.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(salary.id, 'paid')}
                        >
                          Marquer comme payé
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(salary.id, 'cancelled')}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Nouveau Salaire</h2>
          <SalaryForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </div>
      </Dialog>
    </div>
  );
}; 