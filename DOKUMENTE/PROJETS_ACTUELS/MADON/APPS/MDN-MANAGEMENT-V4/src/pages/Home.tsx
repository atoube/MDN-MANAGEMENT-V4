import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  Users, 
  FileText, 
  BarChart2, 
  Calendar, 
  Package, 
  DollarSign, 
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Projets Actifs', value: '12', icon: <CheckCircle className="h-6 w-6" />, color: 'bg-green-100 text-green-600' },
    { label: 'Tâches en Cours', value: '45', icon: <Clock className="h-6 w-6" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Employés', value: '24', icon: <Users className="h-6 w-6" />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Performance', value: '98%', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-yellow-100 text-yellow-600' }
  ];

  const features = [
    {
      title: 'Gestion des Projets',
      description: 'Suivez et gérez tous vos projets en un seul endroit. Créez des tâches, assignez des membres et suivez la progression.',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
      path: '/projects'
    },
    {
      title: 'Gestion des Employés',
      description: 'Gérez les informations des employés, leurs congés et leurs performances.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
      path: '/employees'
    },
    {
      title: 'Documents',
      description: 'Stockez et gérez tous vos documents importants de manière sécurisée.',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      path: '/documents'
    },
    {
      title: 'Tableau de Bord',
      description: 'Visualisez les KPIs et les statistiques importantes de votre entreprise.',
      icon: <BarChart2 className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600',
      path: '/dashboard'
    },
    {
      title: 'Calendrier',
      description: 'Planifiez et suivez les événements, réunions et échéances importantes.',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
      path: '/calendar'
    },
    {
      title: 'Livraisons',
      description: 'Suivez et gérez toutes vos livraisons et expéditions.',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      path: '/deliveries'
    },
    {
      title: 'Finance',
      description: 'Gérez vos finances, factures et budgets de manière efficace.',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      path: '/finance'
    },
    {
      title: 'Ventes',
      description: 'Suivez vos ventes, clients et opportunités commerciales.',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-pink-100 text-pink-600',
      path: '/sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Bienvenue dans MDN Management</h1>
            <p className="text-xl mb-8">
              Votre solution tout-en-un pour la gestion efficace de votre entreprise.
              Gérez vos projets, employés, documents et bien plus encore depuis une seule plateforme.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8"
              onClick={() => navigate('/dashboard')}
            >
              Démarrer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className={`inline-flex items-center justify-center p-2 rounded-full ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 