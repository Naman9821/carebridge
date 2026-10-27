import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ListChecks, AlertTriangle, CalendarDays, ArrowRight } from "lucide-react";
import { useStore } from "@/data/store";
import { Badge, Card, PageHeader, statusTone } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareBridge" },
      { name: "description", content: "Overview of patients, tasks, follow-ups and appointments." },
      { property: "og:title", content: "Dashboard — CareBridge" },
      { property: "og:description", content: "Overview of patients, tasks, follow-ups and appointments." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const pending = s.tasks.filter((t) => t.status === "Pending" || t.status === "In Progress");
  const overdue = s.tasks.filter((t) => t.status === "Overdue");
  const upcoming = s.appointments.filter((a) => a.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const stats = [
    { label: "Total patients", value: s.patients.length, icon: Users, to: "/patients" },
    { label: "Pending tasks", value: pending.length, icon: ListChecks, to: "/tasks" },
    { label: "Overdue follow-ups", value: overdue.length, icon: AlertTriangle, to: "/escalations" },
    { label: "Upcoming appointments", value: upcoming.length, icon: CalendarDays, to: "/appointments" },
  ] as const;

  return (
    <>
      <PageHeader title="Good evening, Dr. Chen" subtitle="Here's what's happening across your care network today." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></span>
              </div>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Upcoming appointments" to="/appointments" />
          <ul className="divide-y">
            {upcoming.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{s.patientName(a.patientId)}</p>
                  <p className="text-muted-foreground">{a.type} · {a.provider}</p>
                </div>
                <span className="text-right text-muted-foreground">{a.date}<br />{a.time}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionTitle title="Tasks needing attention" to="/tasks" />
          <ul className="divide-y">
            {[...overdue, ...pending].slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-muted-foreground">{s.patientName(t.patientId)} · due {t.due}</p>
                </div>
                <Badge tone={statusTone(t.status)}>{t.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function SectionTitle({ title, to }: { title: string; to: "/tasks" | "/appointments" }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="font-semibold">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-primary">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
    </div>
  );
}
