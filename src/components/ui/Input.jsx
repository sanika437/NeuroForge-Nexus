import React from "react";

export const Input = React.forwardRef(({
  className = "",
  label,
  error,
  type = "text",
  required = false,
  floating = true,
  ...props
}, ref) => {
  const isDate = type === "date" || type === "datetime-local" || type === "time";
  const useFloating = floating && !isDate;

  if (useFloating) {
    return (
      <div className="relative w-full flex flex-col">
        <div className="relative">
          <input
            ref={ref}
            type={type}
            placeholder=" " // Required for peer-placeholder-shown to work
            className={`peer flex h-11 w-full rounded-lg border border-border bg-input px-3 pt-5 pb-1.5 text-sm text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
              ${error ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" : ""}
              ${className}`}
            {...props}
          />
          {label && (
            <label className="absolute left-3 top-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider transition-all duration-200 pointer-events-none origin-top-left
              peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
              peer-focus:top-1 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-primary peer-focus:uppercase peer-focus:tracking-wider">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>
        {error && (
          <span className="text-[10px] font-semibold text-red-500 mt-1 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }

  // Classic Layout for Dates / Non-floating fields
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
          ${error ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" : ""}
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-semibold text-red-500 mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
