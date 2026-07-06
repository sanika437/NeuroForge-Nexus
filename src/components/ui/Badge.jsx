import React from "react";

export const Badge = ({ children, className = "", variant = "secondary" }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors border";
  
  const variants = {
    // Basic types
    primary: "bg-primary/10 border-primary/30 text-primary font-bold",
    secondary: "bg-secondary border-border/80 text-muted-foreground font-semibold",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold",
    danger: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 font-bold",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold",

    // Role-specific matching
    Admin: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold",
    "Project Manager": "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold",
    Developer: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold",
    Tester: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold",
    "DevOps Engineer": "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold"
  };

  const currentVariant = variants[variant] || variants.secondary;

  return (
    <span className={`${baseStyles} ${currentVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
