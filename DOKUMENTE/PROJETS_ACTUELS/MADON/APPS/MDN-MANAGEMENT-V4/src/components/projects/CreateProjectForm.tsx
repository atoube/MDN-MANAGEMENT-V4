import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/Form';
import { projectSchema, type ProjectFormData } from '@/schemas/project';
import { ProjectStatus, ProjectPriority } from '@/types/project';

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Simuler la récupération des utilisateurs
    const fetchUsers = async () => {
      // Données simulées pour les utilisateurs
      const mockUsers = [
        { id: 1, name: 'Jean Dupont', email: 'jean@madon.com' },
        { id: 2, name: 'Marie Martin', email: 'marie@madon.com' },
        { id: 3, name: 'Pierre Durand', email: 'pierre@madon.com' }
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      if (!user) throw new Error('Vous devez être connecté pour créer un projet');
      
      // Mock insert operation pour le projet
      const project = {
        id: Date.now().toString(),
        ...data,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock insert operation pour le membre du projet
      const member = {
        project_id: project.id,
        user_id: user.id,
        role: 'creator',
        created_at: new Date().toISOString()
      };

      console.log('Projet créé:', project);
      console.log('Membre ajouté:', member);

      return project;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet créé avec succès');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/projects/${data.id}`);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la création du projet:', error);
      toast.error('Une erreur est survenue lors de la création du projet');
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    createProject.mutate(data);
  };

  return (
    <Form {...form.register} onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <FormField>
        <FormLabel htmlFor="name">Nom du projet</FormLabel>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="Entrez le nom du projet"
          className="w-full"
        />
        {form.formState.errors.name && (
          <FormMessage>{form.formState.errors.name.message}</FormMessage>
        )}
      </FormField>

      <FormField>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Décrivez votre projet"
          rows={4}
          className="w-full"
        />
        {form.formState.errors.description && (
          <FormMessage>{form.formState.errors.description.message}</FormMessage>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField>
          <FormLabel htmlFor="status">Statut</FormLabel>
          <Select
            value={form.watch('status')}
            onValueChange={(value) => form.setValue('status', value as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">En planification</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="on_hold">En attente</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <FormMessage>{form.formState.errors.status.message}</FormMessage>
          )}
        </FormField>

        <FormField>
          <FormLabel htmlFor="priority">Priorité</FormLabel>
          <Select
            value={form.watch('priority')}
            onValueChange={(value) => form.setValue('priority', value as ProjectPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.priority && (
            <FormMessage>{form.formState.errors.priority.message}</FormMessage>
          )}
        </FormField>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createProject.isPending}
        variant="primary"
      >
        {createProject.isPending ? (
          <>
            <span className="loading loading-spinner loading-sm mr-2"></span>
            Création en cours...
          </>
        ) : (
          'Créer le projet'
        )}
      </Button>
    </Form>
  );
} 