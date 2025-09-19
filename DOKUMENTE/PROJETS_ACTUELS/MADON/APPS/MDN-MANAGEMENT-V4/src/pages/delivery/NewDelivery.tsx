import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Plus, Minus, Truck } from 'lucide-react';

interface DeliveryForm {
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  delivery_person_id: string;
  address: string;
  delivery_date: string;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}

interface ClientSuggestion {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
}

export function NewDelivery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [clientSuggestions, setClientSuggestions] = useState<ClientSuggestion[]>([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<Record<number, ProductSuggestion[]>>({});
  const [showProductSuggestions, setShowProductSuggestions] = useState<Record<number, boolean>>({});
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<DeliveryForm>({
    defaultValues: {
      items: [{ product_name: '', quantity: 1, unit_price: 0 }]
    }
  });

  // Fetch delivery personnel
  const { data: deliveryPersonnel } = useQuery({
    queryKey: ['delivery_personnel'],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
// Mock eq call
        .order('first_name');
      
      // Removed error check - using mock data
      return data;
    }
  });

  const handleClientSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setClientSuggestions([]);
      setShowClientSuggestions(false);
      return;
    }
// Mock from call
// Mock select call
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(5);

    if (error) {
      console.error('Error fetching client suggestions:', error);
      return;
    }

    setClientSuggestions(data || []);
    setShowClientSuggestions(true);
  };

  const handleProductSearch = async (searchTerm: string, index: number) => {
    if (searchTerm.length < 2) {
      setProductSuggestions(prev => ({ ...prev, [index]: [] }));
      setShowProductSuggestions(prev => ({ ...prev, [index]: false }));
      return;
    }
// Mock from call
// Mock select call
// Mock eq call
      .ilike('name', `%${searchTerm}%`)
      .limit(5);

    if (error) {
      console.error('Error fetching product suggestions:', error);
      return;
    }

    setProductSuggestions(prev => ({ ...prev, [index]: data || [] }));
    setShowProductSuggestions(prev => ({ ...prev, [index]: true }));
  };

  const handleSelectClient = (client: ClientSuggestion) => {
    setValue('client_first_name', client.first_name);
    setValue('client_last_name', client.last_name);
    setValue('client_email', client.email);
    setValue('client_phone', client.phone || '');
    setShowClientSuggestions(false);
  };

  const handleSelectProduct = (product: ProductSuggestion, index: number) => {
    setValue(`items.${index}.product_name`, product.name);
    setValue(`items.${index}.unit_price`, product.price);
    setShowProductSuggestions(prev => ({ ...prev, [index]: false }));
  };

  const createDelivery = useMutation({
    mutationFn: async (data: DeliveryForm) => {
      // First create or get client
// Mock from call
// Mock select call
// Mock eq call
        .single();

      let clientId;
      if (existingClient) {
        clientId = existingClient.id;
        
        // Update existing client info
// Mock from call
          .update({
            first_name: data.client_first_name,
            last_name: data.client_last_name,
            phone: data.client_phone,
            name: `${data.client_first_name} ${data.client_last_name}`
          })
// Mock eq call;
      } else {
        // Create new client
// Mock from call
          .insert({
            first_name: data.client_first_name,
            last_name: data.client_last_name,
            email: data.client_email,
            phone: data.client_phone,
            name: `${data.client_first_name} ${data.client_last_name}`
          })
          .select()
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // Get or create products and calculate total cost
      let totalCost = 0;
      const productPromises = data.items.map(async (item) => {
// Mock from call
// Mock select call
// Mock eq call
          .single();

        let productId;
        if (existingProduct) {
          productId = existingProduct.id;
        } else {
          // Create new product
// Mock from call
            .insert({
              name: item.product_name,
              price: item.unit_price,
              quantity: 0,
              status: 'in_stock'
            })
            .select()
            .single();

          if (newProductError) throw newProductError;
          productId = newProduct.id;
        }

        totalCost += item.quantity * item.unit_price;
        return { productId, quantity: item.quantity, unit_price: item.unit_price };
      });

      const productDetails = await Promise.all(productPromises);

      // Create delivery
// Mock from call
        .insert({
          client_id: clientId,
          delivery_person_id: data.delivery_person_id,
          address: data.address,
          delivery_date: data.delivery_date,
          status: 'pending',
          cost: totalCost
        })
        .select()
        .single();

      if (deliveryError) throw deliveryError;

      // Create delivery items
// Mock from call
        .insert(
          productDetails.map(({ productId, quantity, unit_price }) => ({
            delivery_id: delivery.id,
            product_id: productId,
            quantity,
            unit_price,
            total_price: quantity * unit_price
          }))
        );

      if (itemsError) throw itemsError;

      // Create initial tracking entry
// Mock from call
        .insert({
          delivery_id: delivery.id,
          status: 'pending',
          notes: 'Livraison créée'
        });

      if (trackingError) throw trackingError;

      return delivery;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      navigate('/deliveries');
    }
  });

  const addItem = () => {
    const items = watch('items');
    setValue('items', [...items, { product_name: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    const items = watch('items');
    setValue('items', items.filter((_, i) => i !== index));
    setProductSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[index];
      return newSuggestions;
    });
    setShowProductSuggestions(prev => {
      const newShow = { ...prev };
      delete newShow[index];
      return newShow;
    });
  };

  const onSubmit = async (data: DeliveryForm) => {
    try {
      await createDelivery.mutateAsync(data);
    } catch (error) {
      console.error('Error creating delivery:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/deliveries')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Nouvelle livraison
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Créer une nouvelle livraison
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Informations client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Input
                label="Prénom"
                error={errors.client_first_name?.message}
                {...register('client_first_name', { required: 'Le prénom est requis' })}
                onChange={(e) => {
                  register('client_first_name').onChange(e);
                  handleClientSearch(e.target.value);
                }}
              />
              {showClientSuggestions && clientSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {clientSuggestions.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Nom"
              error={errors.client_last_name?.message}
              {...register('client_last_name', { required: 'Le nom est requis' })}
            />

            <Input
              label="Email"
              type="email"
              error={errors.client_email?.message}
              {...register('client_email', { 
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
            />

            <Input
              label="Téléphone"
              error={errors.client_phone?.message}
              {...register('client_phone')}
            />

            <Input
              label="Adresse de livraison"
              error={errors.address?.message}
              {...register('address', { required: 'L\'adresse est requise' })}
            />

            <Select
              label="Livreur"
              error={errors.delivery_person_id?.message}
              options={[
                { value: '', label: 'Sélectionnez un livreur' },
                ...(deliveryPersonnel?.map(person => ({
                  value: person.id,
                  label: `${person.first_name} ${person.last_name}`
                })) || [])
              ]}
              {...register('delivery_person_id', { required: 'Le livreur est requis' })}
            />

            <Input
              type="date"
              label="Date de livraison"
              error={errors.delivery_date?.message}
              {...register('delivery_date', { required: 'La date est requise' })}
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Articles
            </h2>
            <Button type="button" variant="secondary" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un article
            </Button>
          </div>

          <div className="space-y-4">
            {watch('items').map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <Input
                    label="Produit"
                    {...register(`items.${index}.product_name`, { required: 'Le produit est requis' })}
                    onChange={(e) => {
                      register(`items.${index}.product_name`).onChange(e);
                      handleProductSearch(e.target.value, index);
                    }}
                  />
                  {showProductSuggestions[index] && productSuggestions[index]?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      {productSuggestions[index].map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                          onClick={() => handleSelectProduct(product, index)}
                        >
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.price} F.CFA</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  type="number"
                  label="Quantité"
                  className="w-32"
                  min={1}
                  {...register(`items.${index}.quantity`, {
                    required: 'La quantité est requise',
                    min: { value: 1, message: 'La quantité doit être positive' }
                  })}
                />

                <Input
                  type="number"
                  label="Prix unitaire"
                  className="w-40"
                  {...register(`items.${index}.unit_price`, {
                    required: 'Le prix est requis',
                    min: { value: 0, message: 'Le prix doit être positif' }
                  })}
                />

                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => removeItem(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            <Truck className="w-4 h-4 mr-2" />
            Créer la livraison
          </Button>
        </div>
      </form>
    </div>
  );
}