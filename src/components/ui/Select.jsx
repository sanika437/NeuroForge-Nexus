import React from "react";

export const Select = React.forwardRef(({
  className = "",
  label,
  error,
  options = [],
  required = false,
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none cursor-pointer
            ${error ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" : ""}
            ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-card text-foreground">
                {lbl}
              </option>
            );
          })}
        </select>
        
        {/* Custom arrow indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/80">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-[10px] font-semibold text-red-500 mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
