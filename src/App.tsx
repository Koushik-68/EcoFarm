import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SoilInput from "./pages/SoilInput";
import Analytics from "./pages/Analytics";
import Weather from "./pages/Weather";
import Calendar from "./pages/Calendar";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import CropManual from "./pages/CropManual";
import Chatbot from "./pages/Chatbot";
import SoilAnalysis from "./pages/SoilAnalysis";
import Marketplace from "./pages/Marketplace";
import Forum from "./pages/Forum";
import SustainablePractices from "./pages/SustainablePractices";
import { isAuthenticated } from "./utils/auth";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/soil-input"
          element={
            <PrivateRoute>
              <SoilInput />
            </PrivateRoute>
          }
        />
        <Route
          path="/soil-analysis"
          element={
            <PrivateRoute>
              <SoilAnalysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <PrivateRoute>
              <Weather />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <PrivateRoute>
              <Knowledge />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/crop-manual"
          element={
            <PrivateRoute>
              <CropManual />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <Marketplace />
            </PrivateRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <PrivateRoute>
              <Forum />
            </PrivateRoute>
          }
        />
        <Route
          path="/sustainable-practices"
          element={
            <PrivateRoute>
              <SustainablePractices />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
