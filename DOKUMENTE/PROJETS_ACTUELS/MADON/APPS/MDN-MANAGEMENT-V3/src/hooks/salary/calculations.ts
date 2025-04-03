import type { Employee, Deduction } from '../../types/salary';

export const calculerSalaireBrut = (employee: Employee): number => {
  const salaireMensuel = employee.salaireBase;
  const totalPrimes = employee.primes.reduce((acc: number, prime) => acc + prime.montant, 0);
  return salaireMensuel + totalPrimes;
};

export const calculerDeductions = (employee: Employee, salaireBrut: number): Deduction[] => {
  return employee.deductions.map(deduction => ({
    ...deduction,
    montant: (salaireBrut * deduction.pourcentage) / 100
  }));
}; 