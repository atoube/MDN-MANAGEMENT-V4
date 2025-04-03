import type { Employee } from '../database.types';

export const testEmployees: Employee[] = [
  {
    id: '1',
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    position: 'Développeur Senior',
    salary: 45000,
    hire_date: '2020-01-15',
    department: 'Développement',
    user_id: 'user1',
    created_at: '2020-01-15T09:00:00Z',
    status: 'active',
    emergency_contact: {
      name: 'Marie Dupont',
      phone: '+33 6 98 76 54 32',
      relationship: 'Épouse'
    },
    skills: ['React', 'TypeScript', 'Node.js'],
    languages: ['Français', 'Anglais'],
    work_preferences: {
      remote: true,
      flexible_hours: true
    }
  },
  {
    id: '2',
    first_name: 'Sophie',
    last_name: 'Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6 23 45 67 89',
    position: 'Chef de Projet',
    salary: 55000,
    hire_date: '2019-06-01',
    department: 'Gestion de Projet',
    user_id: 'user2',
    created_at: '2019-06-01T09:00:00Z',
    status: 'active',
    emergency_contact: {
      name: 'Pierre Martin',
      phone: '+33 6 87 65 43 21',
      relationship: 'Mari'
    },
    skills: ['Gestion de projet', 'Agile', 'Scrum'],
    languages: ['Français', 'Anglais', 'Espagnol']
  },
  {
    id: '3',
    first_name: 'Lucas',
    last_name: 'Bernard',
    email: 'lucas.bernard@example.com',
    phone: '+33 6 34 56 78 90',
    position: 'Designer UI/UX',
    salary: 40000,
    hire_date: '2021-03-10',
    department: 'Design',
    user_id: 'user3',
    created_at: '2021-03-10T09:00:00Z',
    status: 'active',
    emergency_contact: {
      name: 'Emma Bernard',
      phone: '+33 6 76 54 32 10',
      relationship: 'Sœur'
    },
    skills: ['Figma', 'Adobe XD', 'UI/UX Design'],
    languages: ['Français', 'Anglais']
  },
  {
    id: '4',
    first_name: 'Emma',
    last_name: 'Petit',
    email: 'emma.petit@example.com',
    phone: '+33 6 45 67 89 01',
    position: 'Responsable RH',
    salary: 50000,
    hire_date: '2018-09-20',
    department: 'Ressources Humaines',
    user_id: 'user4',
    created_at: '2018-09-20T09:00:00Z',
    status: 'active',
    emergency_contact: {
      name: 'Thomas Petit',
      phone: '+33 6 65 43 21 09',
      relationship: 'Frère'
    },
    skills: ['Recrutement', 'Gestion RH', 'Formation'],
    languages: ['Français', 'Anglais', 'Allemand']
  }
]; 