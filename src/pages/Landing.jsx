import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  Terminal,
  Cpu,
  GitBranch,
  ShieldAlert,
  Layers,
  Activity,
  Database,
  Key,
  Users,
  BarChart3,
  ArrowRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  Zap,
  Cloud,
  PlayCircle,
  Calendar,
  ChevronRight,
  Sun,
  Moon,
  FolderGit2
} from "lucide-react";

// Animated counter component
const StatCounter = ({ end, duration = 1500, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = progress * end;
      setCount(val);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

export const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("sprints");

  // Navigation handlers
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const techStack = [
    { name: "React", icon: Code2, desc: "Interactive SPA Library" },
    { name: "Spring Boot", icon: Cpu, desc: "Microservices Framework" },
    { name: "Java", icon: Code2, desc: "Robust Enterprise Backend" },
    { name: "PostgreSQL", icon: Database, desc: "ACID Relational Storage" },
    { name: "Kafka", icon: Activity, desc: "Real-time Event Streaming" },
    { name: "Redis", icon: Database, desc: "Distributed Session Caching" },
    { name: "Docker", icon: Layers, desc: "Containerized Deployments" },
    { name: "Kubernetes", icon: Cloud, desc: "Orchestration Cluster" },
    { name: "Keycloak", icon: Key, desc: "IAM Single Sign-On Server" }
  ];

  const features = [
    { name: "Project Management", icon: FolderGit2, desc: "Register, monitor, and audit cloud-native applications with manager overrides." },
    { name: "User Management", icon: Users, desc: "Add system operators, assign department structures, and track live status states." },
    { name: "Team Management", icon: Layers, desc: "Group development staff, assign target projects, and log functional capacity workloads." },
    { name: "Sprint Planning", icon: Calendar, desc: "Establish Scrum sprint deliverables, target story points, and state release compliance." },
    { name: "Role Based Access Control", icon: ShieldAlert, desc: "Simulate strict permission boundaries across Admin, PM, Dev, QA, and DevOps." },
    { name: "Cloud Native", icon: Cloud, desc: "Designed to operate cleanly inside modern cloud clusters and serverless container grids." },
    { name: "Microservices", icon: Cpu, desc: "Ready to coordinate message events across independent domain micro-architectures." },
    { name: "CI/CD Engine", icon: GitBranch, desc: "Automate build packaging, code analysis hooks, and release pipelines securely." },
    { name: "Monitoring Logs", icon: Activity, desc: "Examine request availability telemetry, host CPU logs, and latency spikes." },
    { name: "Analytics Dashboard", icon: BarChart3, desc: "Compile story point velocity rates, priorities breakdown, and team headcounts." }
  ];

  const roadmap = [
    { milestone: "Milestone 1", title: "Core SDLC Framework", status: "Completed", desc: "Interactive workspace dashboard, mock local storage database, RBAC simulations, and projects/sprint registry." },
    { milestone: "Milestone 2", title: "Quality Assurance Hub", status: "Coming Soon", desc: "Track system test runs, map regression test coverages, and automate QA defect creation boards." },
    { milestone: "Milestone 3", title: "CI/CD Integration", status: "Coming Soon", desc: "Connect GitHub Actions or Jenkins, inspect deployment build logs, and monitor container packages." },
    { milestone: "Milestone 4", title: "Kubernetes Ops & Monitoring", status: "Coming Soon", desc: "Canary rollbacks, Grafana metrics, host resource logs, and Release Compliance approval flows." }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Transparent Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-border/40 h-16 flex items-center justify-between px-6 sm:px-12">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-white text-base tracking-wider select-none">NF</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            NeuroForge <span className="text-primary font-medium text-sm">Nexus</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-foreground transition-colors cursor-pointer">Home</button>
          <button onClick={() => handleScroll("features")} className="hover:text-foreground transition-colors cursor-pointer">Features</button>
          <button onClick={() => handleScroll("technology")} className="hover:text-foreground transition-colors cursor-pointer">Technology</button>
          <button onClick={() => handleScroll("roadmap")} className="hover:text-foreground transition-colors cursor-pointer">Roadmap</button>
          <button onClick={() => handleScroll("stats")} className="hover:text-foreground transition-colors cursor-pointer">Statistics</button>
        </div>

        {/* Top Right Action Button & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary/80 border border-border/40 hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          {user ? (
            <Button size="sm" onClick={() => navigate("/dashboard")} className="text-xs uppercase tracking-wider">
              Dashboard <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => navigate("/login")} className="text-xs font-bold uppercase tracking-wider border-border/80">
              Sign In
            </Button>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden px-6 sm:px-12 flex flex-col items-center text-center">
        {/* Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/55 text-[10px] font-bold text-primary uppercase tracking-widest mb-2 select-none">
            <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
            Enterprise DevOps Management
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            NeuroForge <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Nexus</span>
          </h1>
          
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-muted-foreground max-w-2xl mx-auto">
            Enterprise Cloud Native Software Development Lifecycle Management Platform
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
             helps organizations govern projects, align engineering teams, coordinate sprint planning, monitor quality compliance checkpoints, and audit production releases.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => handleScroll("features")} className="text-sm font-bold uppercase tracking-wider">
              Explore Platform <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="text-sm font-bold uppercase tracking-wider border-border/80">
              Sign In Securely
            </Button>
          </div>
        </div>

        {/* CSS Mockup Representation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-5xl w-full rounded-2xl border border-border/60 bg-card p-2.5 shadow-2xl relative"
        >
          {/* Mockup header */}
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2 bg-muted/20 rounded-t-xl">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="text-[10px] text-muted-foreground font-semibold ml-2 select-none">neuroforge-nexus-console.sh</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-bold">MILESTONE 1 ACTIVE</span>
            </div>
          </div>
          
          {/* Mockup body */}
          <div className="grid grid-cols-1 md:grid-cols-4 bg-background/50 rounded-b-xl overflow-hidden text-left h-[340px] text-xs">
            {/* Sidebar Mock */}
            <div className="border-r border-border/40 p-4 bg-muted/10 space-y-4 hidden md:block">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block mb-2">Core Registry</span>
                <div className="h-7 rounded bg-primary/10 border border-primary/20 flex items-center px-3 gap-2 text-primary font-semibold">
                  <Terminal className="h-3.5 w-3.5" /> Dashboard
                </div>
                <div className="h-7 rounded hover:bg-muted/40 flex items-center px-3 gap-2 text-muted-foreground">
                  <FolderGit2 className="h-3.5 w-3.5" /> Projects Registry
                </div>
                <div className="h-7 rounded hover:bg-muted/40 flex items-center px-3 gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> User Security
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest block mb-2">Devops Suite</span>
                <div className="h-7 rounded hover:bg-muted/40 flex items-center px-3 justify-between text-muted-foreground/60">
                  <span className="flex items-center gap-2"><Cpu className="h-3.5 w-3.5" /> CI/CD Pipeline</span>
                  <span className="text-[8px] px-1 bg-muted rounded">M3</span>
                </div>
                <div className="h-7 rounded hover:bg-muted/40 flex items-center px-3 justify-between text-muted-foreground/60">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Testing</span>
                  <span className="text-[8px] px-1 bg-muted rounded">M2</span>
                </div>
              </div>
            </div>

            {/* Content Mock */}
            <div className="md:col-span-3 p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border/30 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">SDLC Dashboard Overview</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Monitoring Active sprint cycles and deployments</p>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Keycloak Connected
                </span>
              </div>

              {/* Grid cards mock */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-card border border-border/60 rounded-xl">
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider block">Active Projects</span>
                  <span className="text-lg font-black block mt-1">247</span>
                </div>
                <div className="p-3 bg-card border border-border/60 rounded-xl">
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider block">Total Members</span>
                  <span className="text-lg font-black block mt-1">2,847</span>
                </div>
                <div className="p-3 bg-card border border-border/60 rounded-xl">
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider block">Target Milestone</span>
                  <span className="text-lg font-black text-primary block mt-1">Release 2.3</span>
                </div>
              </div>

              {/* Progress bar mock */}
              <div className="p-4 bg-muted/20 border border-border/30 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                  <span>Sprint 12 Velocity (FinCore Nexus)</span>
                  <span className="text-primary">75% Complete</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div> section
      </section>

      {/* 3. Trusted Technologies Section */}
      <section id="technology" className="py-24 border-t border-border/40 bg-muted/10 px-6 sm:px-12 text-center relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Trusted Cloud Native Technologies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Integrated with core frameworks designed for extreme scaling, sub-millisecond latencies, and enterprise security compliance.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 pt-10">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-sm hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col items-center justify-center group"
                >
                  <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors mb-2.5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors block">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 border-t border-border/40 px-6 sm:px-12 relative">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/55 text-[10px] font-bold text-primary uppercase tracking-widest mb-1 select-none">
            Specifications Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Platform Capabilities Overview
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Discover the unified tools engineered to accelerate SDLC deployments and enforce organizational security controls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 text-left">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/45 hover:-translate-y-1 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors w-max mb-4 border border-border/30">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-extrabold text-sm text-foreground mb-2">{feature.name}</h3>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Milestone Roadmap */}
      <section id="roadmap" className="py-24 border-t border-border/40 bg-muted/10 px-6 sm:px-12 relative">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/55 text-[10px] font-bold text-primary uppercase tracking-widest mb-1 select-none">
            Platform Release Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Development Timeline Specs
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Review completed and upcoming features planned for future sprints.
          </p>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 text-left">
            {roadmap.map((rm, idx) => {
              const isCompleted = rm.status === "Completed";
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border bg-card transition-all duration-200 relative overflow-hidden flex flex-col justify-between
                    ${isCompleted ? "border-emerald-500/20 shadow-sm shadow-emerald-500/5" : "border-border/60"}
                  `}
                >
                  {isCompleted && (
                    <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500" />
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{rm.milestone}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase select-none
                        ${isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}
                      `}>
                        {rm.status}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-foreground mb-2">{rm.title}</h3>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                      {rm.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section id="stats" className="py-20 border-t border-border/40 px-6 sm:px-12 relative text-center bg-card">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              NeuroForge Metrics in Real Time
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
              A snapshot of active usage metrics logged across our cloud development environment nodes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-border/60 bg-background/40">
              <span className="text-3xl sm:text-4xl font-black text-foreground block">
                <StatCounter end={247} />
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2.5 block">Active Projects</span>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-background/40">
              <span className="text-3xl sm:text-4xl font-black text-foreground block">
                <StatCounter end={2847} />
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2.5 block">Registered Users</span>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-background/40">
              <span className="text-3xl sm:text-4xl font-black text-foreground block">
                <StatCounter end={47} />
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2.5 block">Active Teams</span>
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-background/40">
              <span className="text-3xl sm:text-4xl font-black text-primary block">
                <StatCounter end={99.99} decimals={2} suffix="%" />
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2.5 block">Service Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-border/40 py-12 px-6 sm:px-12 bg-background relative text-xs text-muted-foreground/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Logo & Internship */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-sm">
                NF
              </div>
              <span className="font-extrabold text-sm text-foreground tracking-tight">NEUROFORGE NEXUS</span>
            </div>
            <p className="leading-relaxed font-medium">
              Infosys Springboard Virtual Internship 7.0<br />
              Enterprise Platform Architecture Registry v7.0.2
            </p>
            <p className="text-[10px] text-muted-foreground select-none">
              &copy; {new Date().getFullYear()} NeuroForge. All rights reserved.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5"><ExternalLink className="h-3 w-3" /> API Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Development Kit</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Release Compliance Checklists</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Contact & Socials</h4>
              <div className="flex gap-4 pt-1">
                <a href="#" className="p-2 rounded-lg bg-secondary border border-border/40 hover:text-primary transition-colors" aria-label="Github link">
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-lg bg-secondary border border-border/40 hover:text-primary transition-colors" aria-label="LinkedIn link">
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
