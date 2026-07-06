import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoredData, setStoredData, addActivity } from "@/data/dummyData";

const AuthContext = createContext();

const DUMMY_USERS = {
  "admin@neuroforge.com": { name: "Administrator", role: "Admin", department: "Security Operations", team: "N/A" },
  "pm@neuroforge.com": { name: "Sarah Jenkins", role: "Project Manager", department: "Product Delivery", team: "Management Team" },
  "developer@neuroforge.com": { name: "John Developer", role: "Developer", department: "Engineering", team: "Frontend Team" },
  "tester@neuroforge.com": { name: "Sarah Tester", role: "Tester", department: "Quality Assurance", team: "QA Team" },
  "devops@neuroforge.com": { name: "David DevOps", role: "DevOps Engineer", department: "Operations", team: "DevOps Team" }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load logged in user from LocalStorage
    const storedUser = localStorage.getItem("neuroforge_current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lowercaseEmail = email.toLowerCase().trim();
    const matchedUser = DUMMY_USERS[lowercaseEmail];

    if (matchedUser && password === "password") {
      const userData = {
        email: lowercaseEmail,
        ...matchedUser
      };
      setUser(userData);
      localStorage.setItem("neuroforge_current_user", JSON.stringify(userData));
      addActivity(userData.name, "logged in", "Platform Dashboard");
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    if (user) {
      addActivity(user.name, "logged out", "Platform Session");
    }
    setUser(null);
    localStorage.removeItem("neuroforge_current_user");
  };

  // RBAC Permission Helper
  const checkPermission = (action) => {
    if (!user) return false;
    
    const role = user.role;
    if (role === "Admin") return true; // Admin can do everything
    
    switch (action) {
      case "CREATE_PROJECT":
      case "ASSIGN_TEAM":
      case "PLAN_SPRINT":
        return role === "Project Manager"; // PM can do these, Developer/Tester/DevOps cannot
        
      case "REGISTER_USER":
        return false; // Only Admin can register users (we returned true for Admin above)
        
      case "VIEW_USERS":
      case "VIEW_TEAMS":
        return ["Admin", "Project Manager"].includes(role); // Dev, Tester, DevOps cannot access or modify users/teams?
        // Wait, the prompt says for Developer/Tester/DevOps:
        // "Developer: Dashboard, Projects, Sprint. Cannot create project, cannot assign team, cannot register user. Buttons should appear disabled. Show tooltip Access Restricted."
        // "Tester: Dashboard, Projects, Sprint. Everything else disabled."
        // "DevOps: Dashboard, Projects, Sprint. Everything else disabled."
        // This implies they can view Dashboard, Projects, Sprint pages, but Users and Teams pages are disabled for Tester/DevOps/Developer!
        // Let's implement this strictly!
        
      default:
        return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkPermission,
    isAdmin: () => user?.role === "Admin",
    isPM: () => user?.role === "Project Manager",
    isDev: () => user?.role === "Developer",
    isTester: () => user?.role === "Tester",
    isDevOps: () => user?.role === "DevOps Engineer"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
