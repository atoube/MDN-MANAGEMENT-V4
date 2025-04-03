import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export function NewPayroll() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/finance/payroll')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Nouvelle fiche de paie
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Créer une nouvelle fiche de paie
          </p>
        </div>
      </div>

      <form className="space-y-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Informations générales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Employé"
              options={[
                { value: '', label: 'Sélectionnez un employé' },
                { value: '1', label: 'John Doe - Développeur' },
                { value: '2', label: 'Jane Smith - Designer' }
              ]}
            />

            <Input
              type="month"
              label="Période"
            />

            <Input
              type="number"
              label="Salaire de base"
              placeholder="0"
            />

            <Select
              label="Mode de paiement"
              options={[
                { value: '', label: 'Sélectionnez un mode de paiement' },
                { value: 'bank', label: 'Virement bancaire' },
                { value: 'cash', label: 'Espèces' },
                { value: 'mobile', label: 'Mobile Money' }
              ]}
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Éléments de paie
            </h2>
            <Button type="button" variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un élément
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <Select
                label="Type"
                className="flex-1"
                options={[
                  { value: '', label: 'Sélectionnez un type' },
                  { value: 'bonus', label: 'Prime' },
                  { value: 'deduction', label: 'Déduction' },
                  { value: 'tax', label: 'Taxe' }
                ]}
              />

              <Input
                label="Description"
                className="flex-1"
              />

              <Input
                type="number"
                label="Montant"
                className="w-40"
                placeholder="0"
              />

              <Button type="button" variant="secondary">
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary">
            Enregistrer comme brouillon
          </Button>
          <Button type="submit">
            Créer la fiche de paie
          </Button>
        </div>
      </form>
    </div>
  );
}