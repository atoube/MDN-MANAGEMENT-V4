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
import { Instagram, Heart, MessageCircle, Bookmark, Eye, TrendingUp } from 'lucide-react';

const reachData = [
  { date: '2024-01', followers: 8000, reach: 12000, impressions: 15000 },
  { date: '2024-02', followers: 9500, reach: 14000, impressions: 18000 },
  { date: '2024-03', followers: 11000, reach: 16000, impressions: 21000 }
];

const contentPerformance = [
  { type: 'Photos', engagement: 4.5, reach: 2500 },
  { type: 'Reels', engagement: 6.8, reach: 5000 },
  { type: 'Carrousels', engagement: 5.2, reach: 3500 },
  { type: 'Stories', engagement: 3.9, reach: 2000 }
];

const audienceActivity = [
  { hour: '00h', active: 150 },
  { hour: '03h', active: 80 },
  { hour: '06h', active: 200 },
  { hour: '09h', active: 450 },
  { hour: '12h', active: 650 },
  { hour: '15h', active: 850 },
  { hour: '18h', active: 950 },
  { hour: '21h', active: 550 }
];

const topPosts = [
  {
    id: 1,
    type: 'reel',
    description: "✨ Nouveau smartphone en stock ! Découvrez ses fonctionnalités incroyables",
    likes: 1200,
    comments: 85,
    saves: 45,
    reach: 8500
  },
  {
    id: 2,
    type: 'carousel',
    description: "🔥 Guide complet : Comment choisir son smartphone en 2024 ?",
    likes: 950,
    comments: 120,
    saves: 180,
    reach: 7200
  }
];

const COLORS = ['#E4405F', '#10B981', '#F59E0B', '#4F46E5'];

export function InstagramInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Instagram Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyse détaillée de votre présence sur Instagram
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-pink-100 p-3 rounded-full">
            <Instagram className="h-6 w-6 text-[#E4405F]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">@madon_marketplace</p>
            <p className="text-sm text-gray-500">24k abonnés</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-full">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Likes</p>
              <p className="text-2xl font-semibold text-gray-900">2.1k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Commentaires</p>
              <p className="text-2xl font-semibold text-gray-900">205</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Bookmark className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Enregistrements</p>
              <p className="text-2xl font-semibold text-gray-900">225</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Portée</p>
              <p className="text-2xl font-semibold text-gray-900">16k</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Évolution de l'audience">
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
                  dataKey="followers"
                  name="Abonnés"
                  stroke="#E4405F"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="reach"
                  name="Portée"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Performance par type de contenu">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis yAxisId="left" orientation="left" stroke="#E4405F" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="engagement"
                  name="Taux d'engagement (%)"
                  fill="#E4405F"
                />
                <Bar
                  yAxisId="right"
                  dataKey="reach"
                  name="Portée moyenne"
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Activité de l'audience">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="active"
                  name="Utilisateurs actifs"
                  fill="#E4405F"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Publications les plus performantes">
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{post.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-1" />
                        {post.saves.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">{post.type}</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium text-green-500">
                      {((post.likes + post.comments + post.saves) / post.reach * 100).toFixed(1)}% d'engagement
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