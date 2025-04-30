import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle,
  RefreshCw,
  MapPin,
  Calendar
} from 'lucide-react';
import Layout from '../components/Layout';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainfall: number;
  condition: string;
}

function Weather() {
  const [location, setLocation] = useState('Your Farm Location');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([
    'High winds expected tomorrow - Consider postponing spraying operations',
    'Rain forecast for Wednesday - Plan harvesting accordingly'
  ]);

  // Mock weather data - Replace with actual API call
  const weeklyForecast = [
    { day: 'Today', temp: 24, condition: 'Sunny', humidity: 65, rainfall: 0, windSpeed: 12 },
    { day: 'Tomorrow', temp: 22, condition: 'Cloudy', humidity: 70, rainfall: 0, windSpeed: 15 },
    { day: 'Wednesday', temp: 20, condition: 'Rain', humidity: 80, rainfall: 25, windSpeed: 10 },
    { day: 'Thursday', temp: 23, condition: 'Partly Cloudy', humidity: 68, rainfall: 0, windSpeed: 8 },
    { day: 'Friday', temp: 25, condition: 'Sunny', humidity: 62, rainfall: 0, windSpeed: 11 },
    { day: 'Saturday', temp: 24, condition: 'Sunny', humidity: 65, rainfall: 0, windSpeed: 9 },
    { day: 'Sunday', temp: 21, condition: 'Cloudy', humidity: 75, rainfall: 10, windSpeed: 14 },
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'partly cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const refreshWeather = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter location..."
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshWeather}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <select
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              >
                <option value="">7-Day Forecast</option>
                <option value="">14-Day Forecast</option>
                <option value="">Monthly Overview</option>
              </select>
            </div>
          </div>

          {/* Current Weather Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">24°C</p>
                  <p className="text-sm">Feels like 26°C</p>
                </div>
                <Sun className="h-12 w-12" />
              </div>
            </div>
            {[
              { icon: <Droplets className="h-5 w-5" />, label: 'Humidity', value: '65%' },
              { icon: <Wind className="h-5 w-5" />, label: 'Wind', value: '12 km/h NE' },
              { icon: <CloudRain className="h-5 w-5" />, label: 'Rain Chance', value: '10%' },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h2 className="font-semibold text-orange-800">Weather Alerts</h2>
            </div>
            <div className="space-y-2">
              {weatherAlerts.map((alert, index) => (
                <p key={index} className="text-orange-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  {alert}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          {weeklyForecast.map((day, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
              <div className="flex items-center justify-between mb-2">
                {getWeatherIcon(day.condition)}
                <span className="text-2xl font-bold">{day.temp}°C</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <Droplets className="h-4 w-4" />
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <CloudRain className="h-4 w-4" />
                  <span>{day.rainfall}mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <Wind className="h-4 w-4" />
                  <span>{day.windSpeed}km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agricultural Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Farming Calendar Impact
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-1">Ideal Activities</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Harvesting conditions optimal for the next 2 days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Perfect timing for fertilizer application on Thursday
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-800 mb-1">Activities to Avoid</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Postpone spraying due to high winds tomorrow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Delay irrigation due to expected rainfall
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-600" />
              Crop Protection Measures
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Recommended Actions</h3>
                <ul className="space-y-3 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <div>
                      <p className="font-medium">Disease Prevention</p>
                      <p className="text-sm">High humidity levels expected - monitor for fungal diseases</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <div>
                      <p className="font-medium">Frost Protection</p>
                      <p className="text-sm">No frost risk in the next 7 days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Weather;