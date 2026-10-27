import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Users, ListChecks, CalendarDays, Share2, AlertTriangle, ShieldCheck, Menu, HeartPulse, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/referrals", label: "Referrals", icon: Share2 },
  { to: "/escalations", label: "Escalations", icon: AlertTriangle },
  { to: "/consent", label: "Consent", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground"><HeartPulse className="h-5 w-5" /></span>
            <span className="text-lg font-bold">CareBridge</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-sidebar-accent text-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-accent p-4 text-xs text-accent-foreground">
          <p className="font-semibold">Demo mode</p>
          <p className="mt-1 opacity-80">All patient data is fictional.</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="text-sm text-muted-foreground">Connecting clinics, labs, pharmacies & patients</span>
          <div className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">DC</div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
