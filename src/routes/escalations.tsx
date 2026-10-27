import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ChevronsUp, Phone } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import { Badge, Btn, Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/escalations")({
  head: () => ({
    meta: [
      { title: "Escalation Center — CareBridge" },
      { name: "description", content: "Act on missed follow-ups before patients fall through the cracks." },
      { property: "og:title", content: "Escalation Center — CareBridge" },
      { property: "og:description", content: "Act on missed follow-ups before patients fall through the cracks." },
    ],
  }),
  component: Escalations,
});

const levelLabel = { 1: "Level 1 · Care team", 2: "Level 2 · Supervisor", 3: "Level 3 · Medical director" } as const;
const levelTone = { 1: "amber", 2: "red", 3: "red" } as const;

function Escalations() {
  const s = useStore();
  const open = s.escalations.filter((e) => !e.resolved).sort((a, b) => b.level - a.level || b.daysOverdue - a.daysOverdue);
  const done = s.escalations.filter((e) => e.resolved);
  const overdueTasks = s.tasks.filter((t) => t.status === "Overdue");

  return (
    <>
      <PageHeader title="Escalation Center" subtitle={`${open.length} open escalations · ${overdueTasks.length} overdue tasks`} />
      <div className="space-y-4">
        {open.map((e) => {
          const p = s.patients.find((x) => x.id === e.patientId);
          return (
            <Card key={e.id} className="flex flex-wrap items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/10 text-destructive"><AlertTriangle className="h-5 w-5" /></span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{e.issue}</p>
                <p className="text-sm text-muted-foreground">{p?.name} · {e.daysOverdue} days overdue</p>
              </div>
              <Badge tone={levelTone[e.level]}>{levelLabel[e.level]}</Badge>
              <div className="flex flex-wrap gap-2">
                <Btn variant="outline" onClick={() => toast(`Calling ${p?.name} at ${p?.phone}…`)}><Phone className="h-4 w-4" /> Contact</Btn>
                <Btn variant="outline" disabled={e.level === 3} onClick={() => { s.escalate(e.id); toast.warning("Escalated to next level"); }}><ChevronsUp className="h-4 w-4" /> Escalate</Btn>
                <Btn onClick={() => { s.resolveEscalation(e.id); toast.success("Marked resolved"); }}><CheckCircle2 className="h-4 w-4" /> Resolve</Btn>
              </div>
            </Card>
          );
        })}
        {open.length === 0 && <Card className="text-center text-muted-foreground">All caught up — no open escalations.</Card>}
      </div>
      {done.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-semibold">Resolved</h2>
          <div className="space-y-2">
            {done.map((e) => <Card key={e.id} className="flex items-center justify-between py-3 text-sm opacity-70"><span>{e.issue} — {s.patientName(e.patientId)}</span><Badge tone="green">Resolved</Badge></Card>)}
          </div>
        </>
      )}
    </>
  );
}
