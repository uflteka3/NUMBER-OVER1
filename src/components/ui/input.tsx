import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, error, className, ...props },
  ref
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200",
          "hover:border-white/[0.16] focus:border-brand-400/70 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]",
          icon && "pl-11",
          error && "border-danger-500/60 focus:border-danger-400 focus:ring-danger-500/[0.15]",
          className
        )}
        {...props}
      />
    </div>
  );
});

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger-300">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
