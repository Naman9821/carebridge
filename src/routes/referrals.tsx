import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, FlaskConical, Pill, Plus, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import type { Facility, Referral } from "@/data/types";
import { Badge, Btn, Card, Field, Modal, PageHeader, inputCls, statusTone } from "@/components/ui-kit";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Referrals — CareBridge" },
      { name: "description", content: "Send and track referrals to labs, pharmacies and specialists." },
      { property: "og:title", content: "Referrals — CareBridge" },
      { property: "og:description", content: "Send and track referrals to labs, pharmacies and specialists." },
    ],
  }),
  component: Referrals,
});

const icons = { Clinic: Stethoscope, Laboratory: FlaskConical, Pharmacy: Pill };
const next: Partial<Record<Referral["status"], Referral["status"]>> = { Sent: "Accepted", Accepted: "Completed" };

function Referrals() {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | Referral["status"]>("All");
  const [f, setF] = useState({ patientId: s.patients[0]?.id ?? "", from: "Riverside Clinic", to: "ClearPath Labs", toType: "Laboratory" as Facility, reason: "" });
  const list = s.referrals.filter((r) => filter === "All" || r.status === filter);

  return (
    <>
      <PageHeader title="Referrals" subtitle="Coordinate care between clinics, labs and pharmacies." action={<Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New referral</Btn>} />
      <div className="mb-4 flex flex-wrap gap-2">
        {(["All", "Sent", "Accepted", "Completed", "Declined"] as const).map((x) => (
          <Btn key={x} variant={filter === x ? "primary" : "outline"} onClick={() => setFilter(x)}>{x}</Btn>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r) => {
          const Icon = icons[r.toType];
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></span>
                  <div><p className="font-semibold">{s.patientName(r.patientId)}</p><p className="text-sm text-muted-foreground">{r.reason}</p></div>
                </div>
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm">{r.from} <ArrowRight className="h-4 w-4 text-primary" /> <span className="font-medium">{r.to}</span></p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sent {r.date}</span>
                <div className="flex gap-2">
                  {r.status === "Sent" && <Btn variant="outline" onClick={() => { s.setReferralStatus(r.id, "Declined"); toast("Referral declined"); }}>Decline</Btn>}
                  {next[r.status] && <Btn onClick={() => { s.setReferralStatus(r.id, next[r.status]!); toast.success(`Marked ${next[r.status]}`); }}>Mark {next[r.status]}</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No referrals.</p>}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New referral">
        <form className="grid gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (!f.reason) { toast.error("Reason is required"); return; }
          s.addReferral({ ...f, status: "Sent", date: new Date().toISOString().slice(0, 10) }); toast.success("Referral sent"); setOpen(false);
        }}>
          <Field label="Patient"><select className={inputCls} value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })}>{s.patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="From"><input className={inputCls} value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></Field>
            <Field label="To"><input className={inputCls} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></Field>
          </div>
          <Field label="Destination type"><select className={inputCls} value={f.toType} onChange={(e) => setF({ ...f, toType: e.target.value as Facility })}>{["Clinic", "Laboratory", "Pharmacy"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Reason"><input className={inputCls} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-2"><Btn type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn type="submit">Send referral</Btn></div>
        </form>
      </Modal>
    </>
  );
}
