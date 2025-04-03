import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { useSalary } from '../../hooks/useSalary';
import { Badge } from '../ui/Badge';

export function SalaryList() {
  const {
    employees,
    selectedEmployees,
    setSelectedEmployees,
    loading,
    error,
    executerPaiementGroupe,
    isEmployeeEligible
  } = useSalary();

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handlePaiementGroupe = async () => {
    if (selectedEmployees.length === 0) return;
    try {
      await executerPaiementGroupe(selectedEmployees);
      // TODO: Ajouter notification de succès
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      // TODO: Ajouter notification d'erreur
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Salaires</h2>
        <Button
          onClick={handlePaiementGroupe}
          disabled={selectedEmployees.length === 0}
        >
          Payer les salaires sélectionnés ({selectedEmployees.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => {
          const eligible = isEmployeeEligible(employee);
          
          return (
            <Card key={employee.id} className={`p-4 ${!eligible ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                  disabled={!eligible}
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {employee.prenom} {employee.nom}
                    </h3>
                    <Badge
                      variant={eligible ? 'success' : 'warning'}
                    >
                      {eligible ? 'Éligible' : 'Non éligible'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{employee.poste}</p>
                  <p className="text-sm text-gray-500">
                    Salaire base: {employee.salaireBase}€
                  </p>
                  {!eligible && (
                    <p className="text-xs text-red-500 mt-1">
                      Non éligible pour le paiement
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 