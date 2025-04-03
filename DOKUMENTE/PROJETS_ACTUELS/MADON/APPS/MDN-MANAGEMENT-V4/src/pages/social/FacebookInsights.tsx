import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Facebook, ThumbsUp, Share2, MessageCircle, Eye, TrendingUp } from 'lucide-react';

const engagementData = [
  { name: 'Lun', likes: 120, comments: 45, shares: 22 },
  { name: 'Mar', likes: 150, comments: 55, shares: 30 },
  { name: 'Mer', likes: 180, comments: 65, shares: 35 },
  { name: 'Jeu', likes: 140, comments: 50, shares: 25 },
  { name: 'Ven', likes: 200, comments: 75, shares: 40 },
  { name: 'Sam', likes: 80, comments: 30, shares: 15 },
  { name: 'Dim', likes: 50, comments: 20, shares: 10 }
];

const contentTypeData = [
  { name: 'Images', value: 45 },
  { name: 'Vidéos', value: 30 },
  { name: 'Liens', value: 15 },
  { name: 'Texte', value: 10 }
];

const reachData = [
  { date: '2024-01', organic: 15000, paid: 25000 },
  { date: '2024-02', organic: 18000, paid: 28000 },
  { date: '2024-03', organic: 22000, paid: 32000 }
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const bestPerformingPosts = [
  {
    id: 1,
    content: "🌟 Découvrez notre nouvelle collection de smartphones !",
    type: "image",
    engagement: 2500,
    reach: 15000,
    likes: 850,
    shares: 120
  },
  {
    id: 2,
    content: "📱 Guide d'achat : Comment choisir son smartphone en 2024",
    type: "article",
    engagement: 2200,
    reach: 12000,
    likes: 720,
    shares: 95
  }
];

export function FacebookInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Facebook Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyse détaillée de votre présence sur Facebook
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <Facebook className="h-6 w-6 text-[#1877F2]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">MADON Marketplace</p>
            <p className="text-sm text-gray-500">32k abonnés</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Portée totale</p>
              <p className="text-2xl font-semibold text-gray-900">47k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Likes</p>
              <p className="text-2xl font-semibold text-gray-900">2.8k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Commentaires</p>
              <p className="text-2xl font-semibold text-gray-900">340</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Partages</p>
              <p className="text-2xl font-semibold text-gray-900">177</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Engagement hebdomadaire">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" name="Likes" fill="#1877F2" />
                <Bar dataKey="comments" name="Commentaires" fill="#10B981" />
                <Bar dataKey="shares" name="Partages" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Types de contenu performants">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Évolution de la portée">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reachData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="organic"
                  name="Portée organique"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="paid"
                  name="Portée payante"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Publications les plus performantes">
          <div className="space-y-4">
            {bestPerformingPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{post.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.reach.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.shares.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">{post.type}</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium text-green-500">
                      {((post.engagement / post.reach) * 100).toFixed(1)}% d'engagement
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}