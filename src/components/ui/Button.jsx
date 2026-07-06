import React from "react";
import { Loader2 } from "lucide-react";

export const Button = React.forwardRef(({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] cursor-pointer select-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-95 shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-muted border border-border/40 shadow-sm",
    outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-opacity-95 shadow-sm shadow-red-500/10",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary",
    link: "bg-transparent text-primary hover:underline p-0 focus:ring-0 active:scale-100"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5"
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="h-4 w-4 text-current shrink-0" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="h-4 w-4 text-current shrink-0" />}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
