import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Login } from "@/pages/Login";
import { Landing } from "@/pages/Landing";
import { Button } from "@/components/ui/Button";

// Lazy-loaded pages to be written
import { Dashboard } from "@/pages/Dashboard";
import { Projects } from "@/pages/Projects";
import { Users } from "@/pages/Users";
import { Teams } from "@/pages/Teams";
import { SprintPlanning } from "@/pages/SprintPlanning";

// Protected Route shell
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-4">Initializing Security Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Main Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sprints"
        element={
          <ProtectedRoute>
            <SprintPlanning />
          </ProtectedRoute>
        }
      />


      {/* Wildcard redirects */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
            <h1 className="text-8xl font-black text-indigo-500">404</h1>
            <h2 className="text-xl font-bold mt-4">Platform Page Not Found</h2>
            <p className="text-zinc-500 text-xs mt-1">The requested URL is not available in the NeuroForge Nexus system.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.location.href = "/"}>
              Return to Dashboard
            </Button>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
