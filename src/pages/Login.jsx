import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Shield, Lock, Mail, Users, ArrowLeft, Sun, Moon, Activity, CheckCircle2 } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);

    if (result.success) {
      showToast("Welcome back to NeuroForge!", "success");
      navigate("/dashboard");
    } else {
      showToast(result.message || "Invalid credentials", "error");
    }
  };

  const demoUsers = [
    { role: "Admin", email: "admin@neuroforge.com" },
    { role: "Project Manager", email: "pm@neuroforge.com" },
    { role: "Developer", email: "developer@neuroforge.com" },
    { role: "Tester", email: "tester@neuroforge.com" },
    { role: "DevOps Engineer", email: "devops@neuroforge.com" }
  ];

  const handleQuickFill = (email) => {
    setValue("email", email);
    setValue("password", "password");
    showToast(`Credentials selected: ${email}`, "info");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background transition-colors duration-200">
      
      {/* Left side: Back button & Theme toggle & Login form */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 relative">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary/80 border border-border/40 hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
        </div>

        {/* Center portion: Login form */}
        <div className="max-w-[420px] w-full mx-auto my-12 space-y-6">
          <div className="flex items-center gap-2.5 justify-center lg:justify-start">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              NEUROFORGE <span className="text-primary font-semibold text-base">NEXUS</span>
            </span>
          </div>

          <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader className="text-center lg:text-left pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">Access Platform</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-1">
                Sign in to manage cloud-native SDLC environments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Corporate Email Address"
                  placeholder="name@neuroforge.com"
                  type="email"
                  required
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />

                <Input
                  label="Security Password"
                  placeholder="••••••••"
                  type="password"
                  required
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Password is required"
                  })}
                />

                <Button
                  type="submit"
                  loading={submitting}
                  className="w-full mt-2 bg-primary text-primary-foreground font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
                >
                  Sign In Securely
                </Button>
              </form>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <span className="relative bg-card px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Autofill Simulator Roles
                </span>
              </div>

              {/* Quick Login Section */}
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.role}
                    type="button"
                    onClick={() => handleQuickFill(user.email)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-secondary/30 text-[10px] text-muted-foreground hover:border-primary/50 hover:bg-secondary/80 hover:text-foreground transition-all font-bold text-left cursor-pointer"
                  >
                    <span className="truncate">{user.role}</span>
                    <Users className="h-3 w-3 text-muted-foreground/60 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-muted-foreground/60 text-center lg:text-left select-none">
          Activity logging is enabled under tenant security policies. Unauthorized access is strictly prohibited.
        </p>
      </div>

      {/* Right side: Marketing / SDLC Monitoring Illustration */}
      <div className="lg:col-span-7 bg-secondary/30 border-l border-border/40 p-12 flex-col justify-between hidden lg:flex relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="z-10 text-left space-y-4 max-w-xl">
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20 w-max">
            Nexus SDLC Monitor
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Integrated Workspace Ecosystem
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Deploy secure artifacts, coordinate project velocity burndowns, and govern compliance workflows on a unified web console.
          </p>
        </div>

        {/* Custom graphic card showcasing live activities */}
        <div className="my-auto max-w-lg w-full bg-card border border-border/80 rounded-2xl p-6 shadow-xl space-y-5 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kubernetes Nodes Telemetry</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">HEALTHY</span>
          </div>

          <div className="space-y-3">
            {/* Project item */}
            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-foreground block">FinCore Transaction Cluster</span>
                  <span className="text-[10px] text-muted-foreground block">Current: Sprint 12</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">99.99% Uptime</span>
            </div>

            {/* Verification check */}
            <div className="flex items-center justify-between p-3 bg-background/50 border border-border/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-foreground block">Security Policy Enforced</span>
                  <span className="text-[10px] text-muted-foreground block">Provider: Keycloak OAuth2</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500">Active Gate</span>
            </div>
          </div>
        </div>

        <div className="z-10 flex justify-between text-[10px] text-muted-foreground font-semibold">
          <span>Enterprise Platform Console</span>
          <span>v7.0.2</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
