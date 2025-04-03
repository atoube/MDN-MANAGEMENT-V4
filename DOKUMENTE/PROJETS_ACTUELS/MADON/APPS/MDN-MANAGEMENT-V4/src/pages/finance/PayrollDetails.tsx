import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Printer, FileText } from 'lucide-react';

export function PayrollDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/finance/payroll')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Fiche de paie - Mars 2024
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              John Doe - Développeur
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="secondary">
            <FileText className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations générales
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Employé</p>
                <p className="mt-1 text-sm text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Développeur</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Période</p>
                <p className="mt-1 text-sm text-gray-900">Mars 2024</p>
                <p className="text-sm text-gray-500">Du 01/03/2024 au 31/03/2024</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Détail des rubriques
            </h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-medium text-gray-900">Salaire de base</h3>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-gray-500">Salaire mensuel brut</span>
                  <span className="text-sm font-medium text-gray-900">450 000 F.CFA</span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm font-medium text-gray-900">Charges sociales</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">CNPS (3.2%)</span>
                    <span className="text-sm font-medium text-gray-900">14 400 F.CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">IRPP (10%)</span>
                    <span className="text-sm font-medium text-gray-900">45 000 F.CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">TCS (1.8%)</span>
                    <span className="text-sm font-medium text-gray-900">8 100 F.CFA</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Net à payer</span>
                  <span className="text-gray-900">382 500 F.CFA</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Statut
            </h2>
            <div className="space-y-4">
              <div>
                <Badge variant="success">Payée</Badge>
                <p className="mt-2 text-sm text-gray-500">
                  Payée le 25/03/2024
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Mode de paiement</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Virement bancaire
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Historique
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Créée le</span>
                <span className="text-gray-900">20/03/2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Approuvée le</span>
                <span className="text-gray-900">22/03/2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payée le</span>
                <span className="text-gray-900">25/03/2024</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}