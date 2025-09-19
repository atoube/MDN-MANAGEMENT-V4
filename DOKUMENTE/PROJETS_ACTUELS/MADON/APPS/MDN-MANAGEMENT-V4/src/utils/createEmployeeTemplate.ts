import * as XLSX from 'xlsx';

export const createEmployeeTemplate = () => {
  const workbook = XLSX.utils.book_new();
  
  // Données d'exemple
  const exampleData = [{
    'Prénom': 'Jean',
    'Nom': 'Dupont',
    'Email': 'jean.dupont@example.com',
    'Téléphone': '+237612345678',
    'Poste': 'Développeur',
    'Département': 'IT',
    'Salaire': '500000',
    'Date d\'entrée': '2024-01-01',
    'Statut': 'actif'
  }];

  // Créer la feuille avec les données d'exemple
  const worksheet = XLSX.utils.json_to_sheet(exampleData);

  // Ajouter des validations et des commentaires
  worksheet['!cols'] = [
    { wch: 15 }, // Prénom
    { wch: 15 }, // Nom
    { wch: 25 }, // Email
    { wch: 15 }, // Téléphone
    { wch: 20 }, // Poste
    { wch: 15 }, // Département
    { wch: 12 }, // Salaire
    { wch: 12 }, // Date d'entrée
    { wch: 10 }  // Statut
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modèle');
  return workbook;
}; 