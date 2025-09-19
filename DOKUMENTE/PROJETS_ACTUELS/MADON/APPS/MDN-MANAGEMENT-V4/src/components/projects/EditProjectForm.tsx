import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/Form';
import { projectSchema, type ProjectFormData } from '@/schemas/project';
import { ProjectStatus, ProjectPriority } from '@/types/project';

interface EditProjectFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function EditProjectForm({ projectId, onSuccess }: EditProjectFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const getUser = async () => {
            setUser(user);
    };
    
    getUser();

    const { data: { subscription } } =       setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
    },
  });

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
        .single();

      // Removed error check - using mock data
      return data;
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        status: project.status as ProjectStatus,
        priority: project.priority as ProjectPriority,
      });
    }
  }, [project, form]);

  const updateProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      if (!user) throw new Error('Vous devez être connecté pour modifier un projet');
// Mock from call
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
// Mock eq call
        .select()
        .single();

      // Removed error check - using mock data
      return updatedProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Projet modifié avec succès');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/projects/${data.id}`);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la modification du projet:', error);
      toast.error('Une erreur est survenue lors de la modification du projet');
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    updateProject.mutate(data);
  };

  if (isLoadingProject) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

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

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={updateProject.isPending}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={updateProject.isPending}
        >
          {updateProject.isPending ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Modification en cours...
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </Button>
      </div>
    </Form>
  );
} 