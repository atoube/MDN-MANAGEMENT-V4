import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold'], {
    required_error: 'Veuillez sélectionner un statut',
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Veuillez sélectionner une priorité',
  }),
});

export type ProjectFormData = z.infer<typeof projectSchema>; 