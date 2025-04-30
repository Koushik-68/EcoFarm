import { useNavigate } from "react-router-dom";
import {
  Plane as Plant,
  Droplet,
  BarChart3,
  Cloud,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Leaf,
  ThermometerSun,
  Sun,
  Moon,
} from "lucide-react";
import Layout from "../components/Layout";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

  const stats = [
    {
      label: "Soil Analyses",
      value: "12",
      change: "+2.5%",
      changeType: "increase",
      icon: <Plant className="h-5 w-5 text-green-600" />,
      detail: "Last analysis: 2 days ago",
    },
    {
      label: "Crop Health",
      value: "95%",
      change: "+3.2%",
      changeType: "increase",
      icon: <Leaf className="h-5 w-5 text-emerald-600" />,
    },
    {
      label: "Yield Rate",
      value: "92%",
      change: "+4.1%",
      changeType: "increase",
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
    },
    {
      label: "Water Usage",
      value: "-15%",
      change: "-2.4%",
      changeType: "decrease",
      icon: <Droplet className="h-5 w-5 text-cyan-600" />,
    },
  ];

  const alerts = [
    {
      type: "warning",
      message: "Low soil moisture in Field B",
      priority: "high",
    },
    {
      type: "info",
      message: "Optimal planting time for corn approaching",
      priority: "medium",
    },
  ];

  const recentActivities = [
    { date: "2024-03-15", activity: "Soil analysis completed for Field A" },
    { date: "2024-03-14", activity: "New crop recommendation: Wheat" },
    { date: "2024-03-13", activity: "Weather alert: Rain expected" },
    { date: "2024-03-12", activity: "Updated fertilizer schedule" },
  ];

  const weatherSummary = {
    temperature: "24°C",
    humidity: "65%",
    forecast: "Partly Cloudy",
    rainfall: "30%",
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8 animate-fadeInUp bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Enhanced Welcome Section with Dynamic Time-based Background */}
        <div
          className={`mb-10 relative overflow-hidden rounded-2xl p-8 shadow-lg ${
            isNight
              ? "bg-gradient-to-r from-indigo-900 to-purple-900"
              : "bg-gradient-to-r from-green-600 to-emerald-600"
          }`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {isNight ? (
              <Moon className="w-full h-full" />
            ) : (
              <Sun className="w-full h-full" />
            )}
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight animate-slideInLeft text-white">
              Welcome back, {user.name}!
              <span className="text-2xl ml-2">{isNight ? "🌙" : "☀️"}</span>
            </h1>
            <p className="mt-2 text-green-50 text-lg">
              Here's your farm's daily overview 🌱
            </p>
          </div>

          {/* Enhanced Weather Summary */}
          <div className="mt-6 bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <ThermometerSun className="h-10 w-10 text-yellow-300" />
                <div>
                  <p className="text-3xl font-bold text-white">
                    {weatherSummary.temperature}
                  </p>
                  <p className="text-sm text-green-50">Current Temperature</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Cloud className="h-10 w-10 text-blue-300" />
                <div>
                  <p className="text-xl font-semibold text-white">
                    {weatherSummary.forecast}
                  </p>
                  <p className="text-sm text-green-50">Today's Forecast</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Droplet className="h-10 w-10 text-blue-300" />
                <div>
                  <p className="text-xl font-semibold text-white">
                    {weatherSummary.humidity} | {weatherSummary.rainfall}
                  </p>
                  <p className="text-sm text-green-50">
                    Humidity | Rain Chance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-green-100 
                transition-all duration-300 hover:shadow-lg hover:scale-105 
                hover:border-green-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                  {stat.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.label}
                </h3>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-sm ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                  <p className="text-xs text-gray-500">{stat.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Alerts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Active Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-6 rounded-lg 
                  ${
                    alert.priority === "high"
                      ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                  } border transition-all duration-300 hover:shadow-md`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${
                    alert.priority === "high" ? "text-red-500" : "text-blue-500"
                  }`}
                />
                <div>
                  <p className="text-gray-700 font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Priority:{" "}
                    {alert.priority.charAt(0).toUpperCase() +
                      alert.priority.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Soil Analysis",
                desc: "Analyze soil properties and get crop recommendations",
                icon: <Plant className="h-8 w-8 text-green-600" />,
                link: "/soil-input",
                bgColor: "from-green-50 to-emerald-50",
              },
              {
                label: "Weather Forecast",
                desc: "Check local weather conditions and forecasts",
                icon: <Cloud className="h-8 w-8 text-blue-600" />,
                link: "/weather",
                bgColor: "from-blue-50 to-cyan-50",
              },
              {
                label: "Planting Calendar",
                desc: "View and manage your planting schedule",
                icon: <Calendar className="h-8 w-8 text-purple-600" />,
                link: "/calendar",
                bgColor: "from-purple-50 to-pink-50",
              },
              {
                label: "Analytics",
                desc: "View detailed farming analytics and insights",
                icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
                link: "/analytics",
                bgColor: "from-orange-50 to-amber-50",
              },
            ].map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.link)}
                className={`bg-gradient-to-br ${action.bgColor} cursor-pointer 
                  transition-all duration-300 rounded-xl p-6 shadow-sm 
                  hover:shadow-lg group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {action.label}
                </h2>
                <p className="text-gray-600 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>

          {/* Enhanced Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 animate-slideInRight">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Recent Activity
              </h2>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="mt-2">
                    <div
                      className="h-3 w-3 bg-green-500 rounded-full 
                      group-hover:scale-125 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm text-gray-700 font-medium group-hover:text-green-600 
                      transition-colors"
                    >
                      {activity.activity}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
