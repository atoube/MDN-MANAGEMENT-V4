import { Dialog } from '@headlessui/react';
import { FichePaie, Employee } from '../../types/salary';

interface FichePaieDetailProps {
  fichePaie: FichePaie;
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export function FichePaieDetail({
  fichePaie,
  employee,
  isOpen,
  onClose
}: FichePaieDetailProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Fiche de Paie - {employee.prenom} {employee.nom}
          </Dialog.Title>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Informations employé</h3>
                <p>Poste: {employee.poste}</p>
                <p>Type de contrat: {employee.typeContrat}</p>
              </div>
              <div>
                <h3 className="font-medium">Détails du paiement</h3>
                <p>Date: {fichePaie.datePaiement.toLocaleDateString()}</p>
                <p>Status: {fichePaie.status}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Calcul du salaire</h3>
              <div className="mt-2 space-y-2">
                <p>Salaire brut: {fichePaie.salaireBrut}€</p>
                
                {fichePaie.primes.length > 0 && (
                  <div>
                    <p className="font-medium">Primes:</p>
                    {fichePaie.primes.map(prime => (
                      <p key={prime.id}>
                        {prime.type}: +{prime.montant}€
                      </p>
                    ))}
                  </div>
                )}

                {fichePaie.deductions.length > 0 && (
                  <div>
                    <p className="font-medium">Déductions:</p>
                    {fichePaie.deductions.map(deduction => (
                      <p key={deduction.id}>
                        {deduction.type}: -{deduction.pourcentage}%
                      </p>
                    ))}
                  </div>
                )}

                <p className="font-bold mt-4">
                  Salaire net: {fichePaie.salaireNet}€
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 