import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  Package,
  Truck,
  AlertCircle,
  Store,
  ClipboardList,
  TrendingUp,
  Calendar,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';

const salesData = [
  { name: 'Jan', value: 400000 },
  { name: 'Fév', value: 300000 },
  { name: 'Mar', value: 600000 },
  { name: 'Avr', value: 800000 },
  { name: 'Mai', value: 500000 },
  { name: 'Juin', value: 700000 },
];

const deliveryData = [
  { name: 'Lun', value: 12 },
  { name: 'Mar', value: 15 },
  { name: 'Mer', value: 18 },
  { name: 'Jeu', value: 14 },
  { name: 'Ven', value: 20 },
  { name: 'Sam', value: 8 },
  { name: 'Dim', value: 5 },
];

const productDistribution = [
  { name: 'En stock', value: 65 },
  { name: 'En rupture', value: 15 },
  { name: 'En commande', value: 20 },
];

const socialMediaData = [
  { name: 'Jan', facebook: 15000, instagram: 12000, twitter: 8000 },
  { name: 'Fév', facebook: 17000, instagram: 13500, twitter: 8500 },
  { name: 'Mar', facebook: 20000, instagram: 15000, twitter: 9000 },
  { name: 'Avr', facebook: 25000, instagram: 18000, twitter: 11000 },
  { name: 'Mai', facebook: 28000, instagram: 21000, twitter: 12500 },
  { name: 'Juin', facebook: 32000, instagram: 24000, twitter: 14000 },
];

const emailStats = [
  { name: 'Lun', sent: 1200, opened: 720, clicked: 240 },
  { name: 'Mar', sent: 1500, opened: 900, clicked: 375 },
  { name: 'Mer', sent: 1800, opened: 1080, clicked: 450 },
  { name: 'Jeu', sent: 1400, opened: 840, clicked: 350 },
  { name: 'Ven', sent: 2000, opened: 1200, clicked: 500 },
  { name: 'Sam', sent: 800, opened: 480, clicked: 200 },
  { name: 'Dim', sent: 500, opened: 300, clicked: 125 },
];

const COLORS = ['#4F46E5', '#EF4444', '#F59E0B'];

const stats = [
  { name: 'Employés', value: '24', icon: Users, color: 'bg-blue-500', trend: '+12%', path: '/employees' },
  { name: 'Vendeurs', value: '12', icon: Store, color: 'bg-green-500', trend: '+5%', path: '/sellers' },
  { name: 'Produits', value: '1,234', icon: Package, color: 'bg-purple-500', trend: '+8%', path: '/stock' },
  { name: 'Livraisons en attente', value: '8', icon: Truck, color: 'bg-yellow-500', trend: '-3%', path: '/deliveries' },
  { name: 'Produits en rupture', value: '5', icon: AlertCircle, color: 'bg-red-500', trend: '-2%', path: '/stock' },
  { name: 'Tâches urgentes', value: '3', icon: ClipboardList, color: 'bg-orange-500', trend: '0%', path: '/tasks' },
  { name: 'Abonnés sociaux', value: '70K', icon: Share2, color: 'bg-pink-500', trend: '+15%', path: '/marketing' },
  { name: 'Taux d\'engagement', value: '4.8%', icon: Mail, color: 'bg-indigo-500', trend: '+2%', path: '/marketing' },
];

const recentActivities = [
  {
    id: 1,
    type: 'delivery',
    title: 'Nouvelle livraison #12345',
    description: 'En cours de livraison par John Doe',
    time: 'Il y a 1h',
    status: 'en_cours',
    path: '/deliveries'
  },
  {
    id: 2,
    type: 'stock',
    title: 'Alerte stock',
    description: 'Produit XYZ en rupture de stock',
    time: 'Il y a 2h',
    status: 'urgent',
    path: '/stock'
  },
  {
    id: 3,
    type: 'employee',
    title: 'Nouveau employé',
    description: 'Marie Martin a rejoint l\'équipe',
    time: 'Il y a 3h',
    status: 'info',
    path: '/employees'
  }
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPriorityBadge = (status: string) => {
    switch (status) {
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      case 'en_cours':
        return <Badge variant="warning">En cours</Badge>;
      case 'info':
        return <Badge variant="info">Info</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value} produits (${((payload[0].value / 100) * 100).toFixed(0)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de l'activité de MADON Marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const trendIsPositive = stat.trend.startsWith('+');
          return (
            <Card 
              key={stat.name} 
              className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(stat.path)}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <div className={`${stat.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="pt-8 sm:pt-0">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trendIsPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`self-center flex-shrink-0 h-4 w-4 ${
                      trendIsPositive ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className="ml-1">{stat.trend}</span>
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Évolution des ventes">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Livraisons hebdomadaires">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Distribution des produits">
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => (
                      <span className="text-sm text-gray-600">
                        {value} ({entry.payload.value} produits)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card title="Performance réseaux sociaux">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={socialMediaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} abonnés`} />
                <Area
                  type="monotone"
                  dataKey="facebook"
                  stackId="1"
                  stroke="#1877F2"
                  fill="#1877F2"
                  fillOpacity={0.6}
                  name="Facebook"
                />
                <Area
                  type="monotone"
                  dataKey="instagram"
                  stackId="1"
                  stroke="#E4405F"
                  fill="#E4405F"
                  fillOpacity={0.6}
                  name="Instagram"
                />
                <Area
                  type="monotone"
                  dataKey="twitter"
                  stackId="1"
                  stroke="#1DA1F2"
                  fill="#1DA1F2"
                  fillOpacity={0.6}
                  name="Twitter"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Performance email marketing">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emailStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} emails`} />
                <Line
                  type="monotone"
                  dataKey="sent"
                  stroke="#4F46E5"
                  name="Envoyés"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="opened"
                  stroke="#10B981"
                  name="Ouverts"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="clicked"
                  stroke="#F59E0B"
                  name="Cliqués"
                  strokeWidth={2}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Activités récentes">
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== recentActivities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div 
                      className="relative flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                      onClick={() => navigate(activity.path)}
                    >
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          {activity.type === 'delivery' ? (
                            <Truck className="h-5 w-5 text-white" />
                          ) : activity.type === 'stock' ? (
                            <Package className="h-5 w-5 text-white" />
                          ) : (
                            <Users className="h-5 w-5 text-white" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap space-y-1">
                          <div className="text-gray-500">{activity.time}</div>
                          {getPriorityBadge(activity.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}