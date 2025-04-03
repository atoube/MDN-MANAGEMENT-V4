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
import { Twitter, Heart, MessageCircle, Repeat2, Eye, TrendingUp } from 'lucide-react';

const engagementData = [
  { date: '2024-01', likes: 2500, retweets: 800, replies: 400 },
  { date: '2024-02', likes: 3000, retweets: 1000, replies: 600 },
  { date: '2024-03', likes: 3500, retweets: 1200, replies: 800 }
];

const impressionsData = [
  { hour: '00h', impressions: 250 },
  { hour: '03h', impressions: 180 },
  { hour: '06h', impressions: 400 },
  { hour: '09h', impressions: 850 },
  { hour: '12h', impressions: 1250 },
  { hour: '15h', impressions: 1500 },
  { hour: '18h', impressions: 1800 },
  { hour: '21h', impressions: 1200 }
];

const audienceInterests = [
  { name: 'Tech', value: 40 },
  { name: 'E-commerce', value: 30 },
  { name: 'Digital', value: 20 },
  { name: 'Autres', value: 10 }
];

const topTweets = [
  {
    id: 1,
    content: "🚀 Nouvelle arrivée chez MADON ! Le dernier smartphone avec des performances incroyables",
    impressions: 12000,
    likes: 450,
    retweets: 120,
    replies: 45
  },
  {
    id: 2,
    content: "📱 Découvrez notre sélection des meilleurs smartphones pour tous les budgets !",
    impressions: 10000,
    likes: 380,
    retweets: 95,
    replies: 32
  }
];

const COLORS = ['#1DA1F2', '#10B981', '#F59E0B', '#4F46E5'];

export function TwitterInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Twitter Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyse détaillée de votre présence sur Twitter
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <Twitter className="h-6 w-6 text-[#1DA1F2]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">@madon_cameroon</p>
            <p className="text-sm text-gray-500">8.5k abonnés</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Likes</p>
              <p className="text-2xl font-semibold text-gray-900">3.5k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Repeat2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Retweets</p>
              <p className="text-2xl font-semibold text-gray-900">1.2k</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Réponses</p>
              <p className="text-2xl font-semibold text-gray-900">800</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Impressions</p>
              <p className="text-2xl font-semibold text-gray-900">25k</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Engagement mensuel">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" name="Likes" fill="#1DA1F2" />
                <Bar dataKey="retweets" name="Retweets" fill="#10B981" />
                <Bar dataKey="replies" name="Réponses" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Impressions par heure">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impressionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="#1DA1F2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Centres d'intérêt de l'audience">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audienceInterests}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {audienceInterests.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Tweets les plus performants">
          <div className="space-y-4">
            {topTweets.map((tweet) => (
              <div key={tweet.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{tweet.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {tweet.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Repeat2 className="h-4 w-4 mr-1" />
                        {tweet.retweets.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {tweet.replies.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">
                    {((tweet.likes + tweet.retweets + tweet.replies) / tweet.impressions * 100).toFixed(1)}% engagement
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium text-green-500">
                      {tweet.impressions.toLocaleString()} impressions
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