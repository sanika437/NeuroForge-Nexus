import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Login } from "@/pages/Login";
import { Landing } from "@/pages/Landing";
import { ComingSoon } from "@/pages/ComingSoon";
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

      {/* Coming Soon M2/M3/M4 Pages */}
      <Route
        path="/cicd"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="CI/CD Pipeline Engine"
              milestone="Milestone 3"
              description="Deploy automated build, test, and release execution workflows directly from repositories."
              details={[
                "Integrate GitHub Actions and Jenkins pipelines.",
                "Process up to 1,247 builds daily with automated logging.",
                "Achieve automated builds with a targeted 97.4% success rate."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/testing"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="Quality Assurance (QA) Testing"
              milestone="Milestone 2"
              description="Track system test cases, verify QA execution results, and map requirements coverage."
              details={[
                "Manage unit, integration, and UI regression test suites.",
                "Examine live run logs and report bugs to development boards.",
                "Enforce quality gates before merging code changes."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/release"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="Release Compliance Hub"
              milestone="Milestone 4"
              description="Configure releases, control approval signatures, and publish version changelogs."
              details={[
                "Request manager approval for production builds.",
                "Track release schedules and compliance checklists.",
                "Maintain automated audit histories for all deployments."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deployment"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="Kubernetes Deployment Tracking"
              milestone="Milestone 4"
              description="Manage target cloud environments, region distribution nodes, and rollback states."
              details={[
                "Define AWS EC2/RDS/S3 and Azure app service cluster mappings.",
                "Conduct automated Blue-Green or Canary deployment flows.",
                "Trigger immediate environment rollbacks on latency spikes."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="DevOps Telemetry & Logs"
              milestone="Milestone 4"
              description="Monitor production availability, request counts, CPU configurations, and system health."
              details={[
                "Track active memory, CPU loads, and latency metrics.",
                "Integrate Prometheus, Grafana, and ELK stack dashboards.",
                "Minimize mean time to resolution (MTTR) under 12 minutes."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="Platform Reports & Metrics"
              milestone="Milestone 3"
              description="Analyze team velocity models, burndown success rates, and monthly SLA compliance logs."
              details={[
                "Generate sprint velocity and burndown charts.",
                "Compile resource utilisation and workload charts.",
                "Export compliance reports."
              ]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ComingSoon
              moduleName="System Preferences"
              milestone="Milestone 1"
              description="Configure workspace properties, API access tokens, and security directories."
              details={[
                "Synchronize Keycloak identity providers and LDAP logs.",
                "Establish notification alerts and webhook triggers.",
                "Customize UI skins and local language displays."
              ]}
            />
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
