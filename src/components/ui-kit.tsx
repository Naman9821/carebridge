import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-5 shadow-card", className)}>{children}</div>;
}

export function Btn({
  variant = "primary", className, ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-brand text-primary-foreground hover:opacity-90",
    outline: "border bg-card hover:bg-muted",
    ghost: "hover:bg-muted text-muted-foreground",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  }[variant];
  return (
    <button
      {...p}
      className={cn("inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50", v, className)}
    />
  );
}

const tones: Record<string, string> = {
  teal: "bg-accent text-accent-foreground",
  blue: "bg-info/10 text-info",
  green: "bg-success/10 text-success",
  amber: "bg-warning/15 text-foreground",
  red: "bg-destructive/10 text-destructive",
  gray: "bg-muted text-muted-foreground",
};
export function Badge({ tone = "gray", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export const statusTone = (s: string): keyof typeof tones =>
  ({
    Pending: "amber", "In Progress": "blue", Completed: "green", Overdue: "red",
    Active: "teal", "Follow-up": "amber", Discharged: "gray",
    Sent: "blue", Accepted: "teal", Declined: "red", High: "red", Medium: "amber", Low: "gray",
  })[s] ?? "gray";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
export const inputCls = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40";
