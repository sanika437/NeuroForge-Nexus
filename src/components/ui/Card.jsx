import React from "react";

export const Card = React.forwardRef(({ className = "", hover = false, glow = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300
        ${hover ? "hover:border-border hover:-translate-y-1 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/40" : ""}
        ${glow ? "glow-indigo border-indigo-500/20" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

export const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-base font-bold leading-none tracking-tight text-foreground/90 ${className}`} {...props}>
    {children}
  </h3>
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-xs text-muted-foreground font-medium mt-1 ${className}`} {...props}>
    {children}
  </p>
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className = "", children, ...props }) => (
  <div className={`flex items-center p-6 pt-0 border-t border-border/40 mt-4 ${className}`} {...props}>
    {children}
  </div>
);
CardFooter.displayName = "CardFooter";
