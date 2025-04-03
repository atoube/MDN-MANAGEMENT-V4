import React from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Mail, Users, Send, Eye } from 'lucide-react';
import { MarketingAssistant } from '../../components/MarketingAssistant';

interface CampaignForm {
  name: string;
  subject: string;
  content: string;
  recipientGroup: string;
}

const recipientGroups = [
  { value: 'all', label: 'Tous les clients' },
  { value: 'active', label: 'Clients actifs' },
  { value: 'inactive', label: 'Clients inactifs' },
  { value: 'vip', label: 'Clients VIP' }
];

export function NewCampaign() {
  const { register, handleSubmit, watch, setValue } = useForm<CampaignForm>();
  const [preview, setPreview] = React.useState(false);

  const onSubmit = (data: CampaignForm) => {
    console.log(data);
    // Implémenter l'envoi de la campagne
  };

  const content = watch('content');

  const handleSuggestionSelect = (suggestion: string) => {
    setValue('content', suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nouvelle Campagne Email</h1>
          <p className="mt-1 text-sm text-gray-500">
            Créez et envoyez une nouvelle campagne email
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Nom de la campagne"
                placeholder="Ex: Newsletter Mars 2024"
                {...register('name', { required: true })}
              />

              <Input
                label="Objet de l'email"
                placeholder="Ex: Découvrez nos nouveautés !"
                {...register('subject', { required: true })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu de l'email (HTML)
                </label>
                <textarea
                  className="w-full h-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="<h1>Votre contenu HTML ici</h1>"
                  {...register('content', { required: true })}
                />
              </div>

              <Select
                label="Groupe de destinataires"
                options={recipientGroups}
                {...register('recipientGroup', { required: true })}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPreview(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer la campagne
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <MarketingAssistant onSuggestionSelect={handleSuggestionSelect} />

          <Card>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Destinataires estimés</p>
                  <p className="text-2xl font-semibold text-gray-900">2.5k</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Taux d'ouverture moyen</p>
                  <p className="text-2xl font-semibold text-gray-900">35%</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Conseils</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 mr-2" />
                    Utilisez un objet court et accrocheur
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 mr-2" />
                    Personnalisez votre contenu
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 mr-2" />
                    Incluez des appels à l'action clairs
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 mr-2" />
                    Optimisez pour mobile
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {preview && content && (
            <Card className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}