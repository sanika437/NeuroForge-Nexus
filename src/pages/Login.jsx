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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-200 p-4 sm:p-6">
      
      {/* Centered container for form & header/footer */}
      <div className="w-full max-w-[440px] min-h-[620px] flex flex-col justify-between p-6 sm:p-8 bg-card/40 border border-border/60 rounded-2xl shadow-xl backdrop-blur-md relative">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between w-full mb-6">
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
        <div className="w-full space-y-6 my-auto">
          <div className="flex items-center gap-2.5 justify-center">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              NEUROFORGE <span className="text-primary font-semibold text-base">NEXUS</span>
            </span>
          </div>

          <div className="space-y-4">
            <div className="text-center pb-2">
              <h2 className="text-xl font-bold tracking-tight">Access Platform</h2>
              <p className="text-muted-foreground text-xs mt-1">
                Sign in to manage cloud-native SDLC environments.
              </p>
            </div>
            
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
              <span className="relative bg-card/60 px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
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
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-muted-foreground/60 text-center select-none mt-6">
          Activity logging is enabled under tenant security policies. Unauthorized access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default Login;
