import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Enhanced data with more practical farming metrics
const soilData = [
  { type: 'Clay', crops: 45, yield: 75, moisture: 65 },
  { type: 'Sandy', crops: 30, yield: 60, moisture: 40 },
  { type: 'Loamy', crops: 60, yield: 90, moisture: 80 },
  { type: 'Silt', crops: 25, yield: 70, moisture: 70 }
];

const yieldTrendData = [
  { month: 'Jan', yield: 65, target: 70 },
  { month: 'Feb', yield: 68, target: 70 },
  { month: 'Mar', yield: 75, target: 70 },
  { month: 'Apr', yield: 72, target: 70 },
  { month: 'May', yield: 80, target: 70 },
  { month: 'Jun', yield: 85, target: 70 }
];

const fertilizerData = [
  { name: 'Urea', value: 35, cost: 2500 },
  { name: 'DAP', value: 25, cost: 3000 },
  { name: 'NPK', value: 20, cost: 2800 },
  { name: 'Organic', value: 20, cost: 2000 }
];

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899'];

function Analytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState('6m');
  const [loading, setLoading] = React.useState(false);

  const refreshData = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => setLoading(false), 1000);
  };

  const exportData = () => {
    // Implementation for data export
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Farm Analytics</h1>
                <p className="text-green-50">Comprehensive farming insights and trends</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
              <button
                onClick={refreshData}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={exportData}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Average Yield', value: '78%', change: '+5%' },
              { label: 'Soil Health Index', value: '8.5/10', change: '+0.3' },
              { label: 'Water Efficiency', value: '92%', change: '+2%' },
              { label: 'Cost Savings', value: '₹12,500', change: '+15%' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-green-50">{stat.label}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-green-300">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yield Trends */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Yield Trends</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="text-sm border-gray-200 rounded-md focus:ring-green-500">
                  <option>All Crops</option>
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Corn</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yieldTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="yield" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
                <Area type="monotone" dataKey="target" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Soil Performance */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Soil Type Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={soilData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="#22C55E" />
                <Bar dataKey="moisture" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fertilizer Analysis */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fertilizer Distribution & Costs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fertilizerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fertilizerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Panel */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Key Insights</h2>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-6">
              {[
                {
                  title: 'Soil Performance',
                  description: 'Loamy soil shows 20% higher yield compared to other soil types',
                  trend: '+20%',
                  color: 'text-green-500'
                },
                {
                  title: 'Cost Optimization',
                  description: 'Organic fertilizers reduced costs by 15% while maintaining yield',
                  trend: '-15%',
                  color: 'text-blue-500'
                },
                {
                  title: 'Water Management',
                  description: 'Improved irrigation system increased water efficiency',
                  trend: '+8%',
                  color: 'text-yellow-500'
                },
                {
                  title: 'Yield Prediction',
                  description: 'Expected 10% increase in next harvest based on current trends',
                  trend: '+10%',
                  color: 'text-purple-500'
                }
              ].map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`mt-1 w-2 h-2 rounded-full ${insight.color.replace('text', 'bg')}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <span className={`text-sm font-medium ${insight.color}`}>{insight.trend}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;