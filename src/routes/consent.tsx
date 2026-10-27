import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import { Badge, Card, PageHeader, inputCls } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/consent")({
  head: () => ({
    meta: [
      { title: "Consent & Permissions — CareBridge" },
      { name: "description", content: "Control which providers can access patient information." },
      { property: "og:title", content: "Consent & Permissions — CareBridge" },
      { property: "og:description", content: "Control which providers can access patient information." },
    ],
  }),
  component: Consent,
});

function Consent() {
  const s = useStore();
  const [pid, setPid] = useState("all");
  const list = s.consents.filter((c) => pid === "all" || c.patientId === pid);
  const granted = s.consents.filter((c) => c.granted).length;

  return (
    <>
      <PageHeader
        title="Consent & Permissions"
        subtitle={`${granted} of ${s.consents.length} data-sharing permissions active`}
        action={
          <select className={inputCls + " w-56"} value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Filter by patient">
            <option value="all">All patients</option>
            {s.patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <span className={cn("grid h-10 w-10 place-items-center rounded-xl", c.granted ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                {c.granted ? <ShieldCheck className="h-5 w-5" /> : <ShieldOff className="h-5 w-5" />}
              </span>
              <button
                role="switch"
                aria-checked={c.granted}
                aria-label={`Toggle ${c.scope} for ${c.party}`}
                onClick={() => { s.toggleConsent(c.id); toast.success(c.granted ? "Access revoked" : "Access granted"); }}
                className={cn("relative h-6 w-11 rounded-full transition", c.granted ? "bg-primary" : "bg-input")}
              >
                <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all", c.granted ? "left-5.5" : "left-0.5")} />
              </button>
            </div>
            <p className="mt-4 font-semibold">{s.patientName(c.patientId)}</p>
            <p className="text-sm text-muted-foreground">{c.scope} → {c.party}</p>
            <div className="mt-4 flex items-center justify-between">
              <Badge tone="blue">{c.partyType}</Badge>
              <span className="text-xs text-muted-foreground">Updated {c.updated}</span>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No permissions on file for this patient.</p>}
      </div>
    </>
  );
}
