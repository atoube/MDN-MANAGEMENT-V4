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
import { Linkedin, Users, Eye, ThumbsUp, MessageCircle, TrendingUp } from 'lucide-react';

const visitorMetrics = [
  { date: '2024-01', pageViews: 1200, uniqueVisitors: 800 },
  { date: '2024-02', pageViews: 1500, uniqueVisitors: 1000 },
  { date: '2024-03', pageViews: 1800, uniqueVisitors: 1200 }
];

const followerDemographics = [
  { name: 'Tech', value: 35 },
  { name: 'Retail', value: 25 },
  { name: 'Marketing', value: 20 },
  { name: 'Finance', value: 20 }
];

const engagementRate = [
  { date: '2024-01', rate: 3.2 },
  { date: '2024-02', rate: 3.8 },
  { date: '2024-03', rate: 4.5 }
];

const topPosts = [
  {
    id: 1,
    content: "🚀 MADON Marketplace continue son expansion ! Découvrez nos nouveaux produits tech",
    impressions: 5000,
    engagement: 8.5,
    reactions: 250,
    comments: 45
  },
  {
    id: 2,
    content: "📱 L'avenir de la tech en Afrique : Notre vision chez MADON",
    impressions: 4200,
    engagement: 7.2,
    reactions: 180,
    comments: 32
  }
];

const COLORS = ['#0A66C2', '#10B981', '#F59E0B', '#4F46E5'];

export function LinkedinInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">LinkedIn Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyse détaillée de votre présence sur LinkedIn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">MADON Cameroon</p>
            <p className="text-sm text-gray-500">15k abonnés</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Abonnés</p>
              <p className="text-2xl font-semibold text-gray-900">15k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vues de page</p>
              <p className="text-2xl font-semibold text-gray-900">1.8k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <ThumbsUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Réactions</p>
              <p className="text-2xl font-semibold text-gray-900">430</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Commentaires</p>
              <p className="text-2xl font-semibold text-gray-900">77</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Visiteurs et vues de page">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  name="Vues de page"
                  stroke="#0A66C2"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Visiteurs uniques"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Secteurs d'activité des abonnés">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={followerDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {followerDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Taux d'engagement">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="rate"
                  name="Taux d'engagement (%)"
                  fill="#0A66C2"
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
                    <p className="text-sm font-medium text-gray-900">{post.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.impressions.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.reactions.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">
                    {post.engagement}% engagement
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium text-green-500">
                      Performance supérieure de {(post.engagement - 4.5).toFixed(1)}% à la moyenne
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