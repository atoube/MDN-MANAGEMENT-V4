export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  salaireBase: number;
  typeContrat: 'CDI' | 'CDD' | 'INTERIM' | 'TERMINE';
  primes: Prime[];
  deductions: Deduction[];
  dateEmbauche: Date;
  status: 'ACTIVE' | 'INACTIF' | 'CONGE' | 'SUSPENDU';
}

export interface Prime {
  id: string;
  type: string;
  montant: number;
  description: string;
}

export interface Deduction {
  id: string;
  type: string;
  pourcentage: number;
  description: string;
  montant: number;
}

export interface FichePaie {
  id: string;
  employeeId: string;
  datePaiement: Date;
  salaireBrut: number;
  salaireNet: number;
  primes: Prime[];
  deductions: Deduction[];
  heuresSupplementaires: number;
  status: 'EN_ATTENTE' | 'PAYÉ' | 'ERREUR';
}

export interface PaiementGroupe {
  id: string;
  dateExecution: Date;
  employeeIds: string[];
  montantTotal: number;
  status: 'EN_ATTENTE' | 'TRAITEMENT' | 'COMPLÉTÉ' | 'ERREUR';
  fichesPaie: FichePaie[];
} 