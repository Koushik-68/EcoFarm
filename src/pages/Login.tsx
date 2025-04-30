import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Sprout } from "lucide-react";
import { loginUser } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = loginUser(formData.email, formData.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-green-200 animate-fadeInSlow">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="backdrop-blur-md bg-white/60 shadow-2xl border border-green-200 rounded-3xl max-w-md w-full px-10 py-12 animate-slideUp">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sprout className="h-12 w-12 text-green-600 animate-bounce-slow" />
            </div>
            <h2 className="text-4xl font-bold text-green-800">EcoFarm Login</h2>
            <p className="mt-1 text-gray-600">Welcome back to sustainability</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-5 border border-transparent rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg transition-transform duration-300"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </button>

            <div className="text-center pt-2">
              <Link
                to="/register"
                className="text-sm text-green-700 hover:text-green-600 underline transition"
              >
                Don’t have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration + Features */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden animate-slideLeft">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white max-w-lg space-y-6">
              <h2 className="text-4xl font-bold">Grow Smarter</h2>
              <ul className="space-y-4 text-lg">
                {[
                  "Smart soil analysis and crop recommendations",
                  "Sustainable farming practices",
                  "Real-time weather monitoring",
                  "Comprehensive analytics and insights",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="h-2 w-2 bg-white rounded-full mt-2 mr-3 animate-ping" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
