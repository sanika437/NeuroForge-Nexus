import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  Network,
  CalendarDays,
  GitFork,
  CheckSquare,
  Package,
  CloudLightning,
  LineChart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  ShieldAlert,
  Sun,
  Moon
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/login");
  };

  // Define sidebar menu items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, category: "Core", functional: true },
    { name: "Projects", path: "/projects", icon: FolderGit2, category: "Core", functional: true },
    { name: "Users", path: "/users", icon: Users, category: "Core", functional: true },
    { name: "Teams", path: "/teams", icon: Network, category: "Core", functional: true },
    { name: "Sprint Planning", path: "/sprints", icon: CalendarDays, category: "Core", functional: true },
    
    { name: "CI/CD Pipeline", path: "/cicd", icon: GitFork, category: "DevOps & QA", functional: false, milestone: "Milestone 3" },
    { name: "Testing", path: "/testing", icon: CheckSquare, category: "DevOps & QA", functional: false, milestone: "Milestone 2" },
    { name: "Release Management", path: "/release", icon: Package, category: "Delivery", functional: false, milestone: "Milestone 4" },
    { name: "Deployment", path: "/deployment", icon: CloudLightning, category: "Delivery", functional: false, milestone: "Milestone 4" },
    { name: "Monitoring", path: "/monitoring", icon: LineChart, category: "Operations", functional: false, milestone: "Milestone 4" },
    { name: "Reports", path: "/reports", icon: BarChart3, category: "Operations", functional: false, milestone: "Milestone 3" },
    
    { name: "Settings", path: "/settings", icon: Settings, category: "System", functional: false, milestone: "Milestone 1" }
  ];

  // Group menu items by category for professional categorization
  const categories = ["Core", "DevOps & QA", "Delivery", "Operations", "System"];

  // Dynamic breadcrumbs based on location path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
        <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate("/")}>Nexus</span>
        {paths.map((p, i) => {
          const isLast = i === paths.length - 1;
          const formatted = p.charAt(0).toUpperCase() + p.slice(1).replace("-", " ");
          return (
            <React.Fragment key={p}>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span className={isLast ? "text-foreground font-semibold" : "hover:text-foreground cursor-pointer transition-colors"} onClick={() => !isLast && navigate(`/${paths.slice(0, i + 1).join("/")}`)}>
                {formatted}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderNavLinks = () => {
    return categories.map((cat) => {
      const items = menuItems.filter((i) => i.category === cat);
      if (items.length === 0) return null;

      return (
        <div key={cat} className="mb-4">
          {!isSidebarCollapsed && (
            <p className="px-4 text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-widest mb-2 select-none">
              {cat}
            </p>
          )}
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group relative
                    ${isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border-l-2 border-transparent"
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`} />
                  
                  {!isSidebarCollapsed && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}

                  {/* Future Milestone Indicators */}
                  {!isSidebarCollapsed && !item.functional && item.milestone && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/60 font-bold shrink-0">
                      Coming Soon
                    </span>
                  )}

                  {/* Collapsed sidebar tooltips */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-xl">
                      {item.name} {!item.functional && `(${item.milestone})`}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      
      {/* Top sticky header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/80 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        {/* Left header portion */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="sm:hidden text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-white text-sm tracking-wider select-none">NF</span>
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hidden sm:inline-block">
              NEUROFORGE <span className="text-primary font-medium text-xs">NEXUS</span>
            </span>
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden sm:flex text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-lg transition-colors ml-4 cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Breadcrumbs */}
          <div className="hidden lg:block ml-4 border-l border-border/80 pl-4">
            {getBreadcrumbs()}
          </div>
        </div>

        {/* Right header portion (Global Search, Theme Toggle, Notifications, Profile) */}
        <div className="flex items-center gap-3">
          
          {/* Global Search Bar */}
          <div className="relative max-w-xs hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
            </span>
            <input
              type="text"
              placeholder="Search registry, pipelines..."
              className="w-56 pl-9 pr-4 py-1.5 bg-input border border-border rounded-lg text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-foreground"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary/60 border border-border/40 hover:bg-secondary transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors relative cursor-pointer border border-border/40 bg-secondary/30"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full border border-card animate-pulse"></span>
            </button>

            {isNotificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-80 bg-card border border-border rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-border/60">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider">Workspace Alerts</h4>
                    <span className="text-[10px] text-primary font-bold uppercase cursor-pointer hover:underline">Clear notifications</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    <div className="text-xs p-3 hover:bg-secondary/40 rounded-xl border border-border/40 bg-background/30 transition-all">
                      <p className="font-bold text-foreground">Sprint 12 Burndown Alert</p>
                      <p className="text-muted-foreground text-[10px] mt-1">FinCore Nexus remaining work is 12 story points.</p>
                      <span className="text-[9px] text-muted-foreground/60 block mt-2">10 minutes ago</span>
                    </div>
                    <div className="text-xs p-3 hover:bg-secondary/40 rounded-xl border border-border/40 bg-background/30 transition-all">
                      <p className="font-bold text-foreground">User Registered</p>
                      <p className="text-muted-foreground text-[10px] mt-1">Admin registered David DevOps to DevOps Team.</p>
                      <span className="text-[9px] text-muted-foreground/60 block mt-2">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative border-l border-border/80 pl-3">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 hover:bg-secondary rounded-lg transition-colors text-left cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-extrabold text-white text-xs shadow-md">
                {user ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden lg:flex flex-col text-xs leading-none">
                <span className="font-bold text-foreground">{user?.name || "Guest User"}</span>
                <span className="text-[9px] text-primary font-semibold uppercase tracking-wider mt-1">{user?.role || "Tester"}</span>
              </div>
            </button>

            {isProfileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-56 bg-card border border-border rounded-xl shadow-2xl p-2.5 z-50">
                  <div className="p-3 border-b border-border/60 mb-2">
                    <p className="text-sm font-bold text-foreground leading-none">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">{user?.email}</p>
                    <div className="mt-2.5">
                      <Badge variant={user?.role}>{user?.role}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground select-none">
                      <span className="font-bold text-muted-foreground/60">Department:</span> {user?.department || "Engineering"}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground select-none border-b border-border/60 pb-2.5 mb-1.5">
                      <span className="font-bold text-muted-foreground/60">Assigned Team:</span> {user?.team || "QA Team"}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-left font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Logout Security Session
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left desktop sidebar */}
        <aside
          className={`hidden sm:flex flex-col bg-card border-r border-border/80 transition-all duration-300 z-10 shrink-0
            ${isSidebarCollapsed ? "w-20" : "w-64"}
          `}
        >
          <div className="flex-1 overflow-y-auto py-5 flex flex-col justify-between">
            <nav className="px-2 space-y-1">
              {renderNavLinks()}
            </nav>
            
            {/* Quick stats / Logged status in expanded sidebar */}
            {!isSidebarCollapsed && (
              <div className="mx-4 p-4 bg-secondary/30 border border-border/80 rounded-xl mt-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-500" />
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Security State</span>
                </div>
                <p className="text-xs font-bold text-foreground mt-1">Keycloak Connected</p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border/60 flex justify-center">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 text-muted-foreground hover:text-red-500 p-2.5 rounded-lg hover:bg-red-500/5 transition-colors w-full cursor-pointer
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile sidebar (Drawer) */}
        {isMobileSidebarOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 sm:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-40 p-4 flex flex-col justify-between sm:hidden shadow-2xl">
              <div className="flex-1 overflow-y-auto py-2">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="h-8.5 w-8.5 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <span className="font-extrabold text-white text-base">NF</span>
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-foreground">NEUROFORGE</span>
                  </div>
                </div>
                <nav className="space-y-1">
                  {renderNavLinks()}
                </nav>
              </div>
              <div className="pt-4 border-t border-border/60">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout Session
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between bg-background">
          <div className="flex-1 pb-12">
            {children}
          </div>
          
          {/* Footer inside layout */}
          <footer className="border-t border-border/60 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground/80">NeuroForge Nexus</span>
              <span>• Enterprise Platform v7.0.2</span>
            </div>
            <div className="flex items-center gap-4 font-semibold">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-secondary border border-border/80 text-emerald-500 font-bold select-none">
                Milestone 1 Active
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
