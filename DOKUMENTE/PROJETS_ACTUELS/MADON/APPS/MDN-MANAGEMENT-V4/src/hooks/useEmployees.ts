import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Employee, Absence } from '../types';
import { useEffect } from 'react';

export function useEmployees() {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Employee[];
    }
  });

  const { data: absences, isLoading: isLoadingAbsences } = useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('absences')
        .select(`
          *,
          employees (
            first_name,
            last_name
          )
        `)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as (Absence & {
        employees: { first_name: string; last_name: string };
      })[];
    }
  });

  const createEmployee = useMutation({
    mutationFn: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          ...employeeData,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...employee }: Partial<Employee> & { id: string }) => {
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'inactive' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const createAbsence = useMutation({
    mutationFn: async (absence: Omit<Absence, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('absences')
        .insert({
          ...absence,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    }
  });

  const updateAbsenceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('absences')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    }
  });

  return {
    employees,
    absences,
    isLoading: isLoadingEmployees || isLoadingAbsences,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createAbsence,
    updateAbsenceStatus
  };
}