import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Employee } from '../../types';

interface AdministrativeManagementProps {
  onSubmit: (data: Partial<Employee>) => void;
  employee: Employee;
}

interface FormData {
  administrative_info: {
    employee_id: string;
    badge_number: string;
    access_level: string;
    equipment: string[];
    documents: string[];
  };
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
    address?: string;
  };
  skills: string[];
  languages: {
    language: string;
    level: string;
  }[];
  educations: {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
    grade?: string;
  }[];
  work_preferences: {
    remote: boolean;
    flexible_hours: boolean;
    preferred_hours: string;
    preferred_location: string;
  };
  certifications: {
    name: string;
    issuer: string;
    date: string;
    expiry_date?: string;
  }[];
  leave_balance: {
    annual: number;
    sick: number;
    other: number;
  };
  benefits: {
    health_insurance: boolean;
    life_insurance: boolean;
    retirement_plan: boolean;
    other_benefits: string[];
  };
}

export function AdministrativeManagement({
  onSubmit,
  employee
}: AdministrativeManagementProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      administrative_info: {
        employee_id: employee.administrative_info?.employee_id || '',
        badge_number: employee.administrative_info?.badge_number || '',
        access_level: employee.administrative_info?.access_level || '',
        equipment: employee.administrative_info?.equipment?.map(e => typeof e === 'string' ? e : e.type) || [],
        documents: employee.administrative_info?.documents?.map(d => typeof d === 'string' ? d : d.type) || []
      },
      emergency_contact: employee.emergency_contact || {
        name: '',
        phone: '',
        relationship: '',
        address: ''
      },
      skills: employee.skills || [],
      languages: employee.languages?.map(lang => ({
        language: lang,
        level: ''
      })) || [],
      educations: employee.educations || [{
        institution: '',
        degree: '',
        field: '',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString()
      }],
      work_preferences: {
        remote: employee.work_preferences?.remote || false,
        flexible_hours: employee.work_preferences?.flexible_hours || false,
        preferred_hours: '',
        preferred_location: ''
      },
      certifications: employee.certifications || [{
        name: '',
        issuer: '',
        date: '',
        expiry_date: ''
      }],
      leave_balance: employee.leave_balance || {
        annual: 0,
        sick: 0,
        other: 0
      },
      benefits: employee.benefits || {
        health_insurance: false,
        life_insurance: false,
        retirement_plan: false,
        other_benefits: []
      }
    }
  });

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      id: employee.id,
      languages: data.languages.map(lang => lang.language),
      work_preferences: {
        remote: data.work_preferences.remote,
        flexible_hours: data.work_preferences.flexible_hours
      },
      administrative_info: {
        ...data.administrative_info,
        equipment: data.administrative_info.equipment.map(type => ({
          type,
          serial_number: '',
          assigned_date: new Date().toISOString()
        })),
        documents: data.administrative_info.documents.map(type => ({
          type,
          number: '',
          expiry_date: new Date().toISOString(),
          file_url: ''
        }))
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Informations administratives</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ID Employé"
              error={errors.administrative_info?.employee_id?.message}
              {...register('administrative_info.employee_id')}
            />
            <Input
              label="Numéro de badge"
              error={errors.administrative_info?.badge_number?.message}
              {...register('administrative_info.badge_number')}
            />
            <Select
              label="Niveau d'accès"
              options={[
                { value: 'basic', label: 'Basique' },
                { value: 'intermediate', label: 'Intermédiaire' },
                { value: 'advanced', label: 'Avancé' },
                { value: 'admin', label: 'Administrateur' }
              ]}
              error={errors.administrative_info?.access_level?.message}
              {...register('administrative_info.access_level')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Contact d'urgence</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              error={errors.emergency_contact?.name?.message}
              {...register('emergency_contact.name')}
            />
            <Input
              label="Téléphone"
              error={errors.emergency_contact?.phone?.message}
              {...register('emergency_contact.phone')}
            />
            <Input
              label="Relation"
              error={errors.emergency_contact?.relationship?.message}
              {...register('emergency_contact.relationship')}
            />
            <Input
              label="Adresse"
              error={errors.emergency_contact?.address?.message}
              {...register('emergency_contact.address')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Compétences et Langues</h3>
          <div className="space-y-4">
            <Input
              label="Compétences (séparées par des virgules)"
              error={errors.skills?.message}
              {...register('skills')}
            />
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <Input
                    label={`Langue ${index + 1}`}
                    {...register(`languages.${index}.language`)}
                  />
                  <Select
                    label="Niveau"
                    options={[
                      { value: 'beginner', label: 'Débutant' },
                      { value: 'intermediate', label: 'Intermédiaire' },
                      { value: 'advanced', label: 'Avancé' },
                      { value: 'native', label: 'Langue maternelle' }
                    ]}
                    {...register(`languages.${index}.level`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Formation</h3>
          <div className="space-y-4">
            {[0, 1].map((index) => (
              <div key={index} className="space-y-4">
                <Input
                  label="Diplôme"
                  {...register(`educations.${index}.degree`)}
                />
                <Input
                  label="Établissement"
                  {...register(`educations.${index}.institution`)}
                />
                <Input
                  label="Domaine d'étude"
                  {...register(`educations.${index}.field`)}
                />
                <Input
                  label="Date de début"
                  type="date"
                  {...register(`educations.${index}.start_date`)}
                />
                <Input
                  label="Date de fin"
                  type="date"
                  {...register(`educations.${index}.end_date`)}
                />
                <Input
                  label="Note"
                  {...register(`educations.${index}.grade`)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Préférences de travail</h3>
          <div className="space-y-4">
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('work_preferences.remote')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Télétravail</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('work_preferences.flexible_hours')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Horaires flexibles</span>
              </label>
            </div>
            <Input
              label="Horaires préférés"
              {...register('work_preferences.preferred_hours')}
            />
            <Input
              label="Lieu de travail préféré"
              {...register('work_preferences.preferred_location')}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Certifications</h3>
          {[0, 1].map((index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <Input
                label="Nom de la certification"
                {...register(`certifications.${index}.name`)}
              />
              <Input
                label="Organisme émetteur"
                {...register(`certifications.${index}.issuer`)}
              />
              <Input
                label="Date d'obtention"
                type="date"
                {...register(`certifications.${index}.date`)}
              />
              <Input
                label="Date d'expiration"
                type="date"
                {...register(`certifications.${index}.expiry_date`)}
              />
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Avantages et congés</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Congés annuels"
                type="number"
                {...register('leave_balance.annual')}
              />
              <Input
                label="Congés maladie"
                type="number"
                {...register('leave_balance.sick')}
              />
              <Input
                label="Autres congés"
                type="number"
                {...register('leave_balance.other')}
              />
            </div>
            <div className="space-y-4">
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('benefits.health_insurance')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Assurance santé</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('benefits.life_insurance')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Assurance vie</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('benefits.retirement_plan')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Plan de retraite</span>
                </label>
              </div>
              <Input
                label="Autres avantages (séparés par des virgules)"
                {...register('benefits.other_benefits')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 sticky bottom-0 bg-white p-4 border-t">
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
} 