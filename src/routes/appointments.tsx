import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/data/store";
import { Btn, Card, Field, Modal, PageHeader, inputCls } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments — CareBridge" },
      { name: "description", content: "Monthly appointments calendar for your care network." },
      { property: "og:title", content: "Appointments — CareBridge" },
      { property: "og:description", content: "Monthly appointments calendar for your care network." },
    ],
  }),
  component: Appointments,
});

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function Appointments() {
  const s = useStore();
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(iso(now));
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ patientId: s.patients[0]?.id ?? "", time: "10:00", provider: "Dr. Chen", type: "Consultation" });

  const start = new Date(month); start.setDate(1 - month.getDay());
  const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const dayAppts = s.appointments.filter((a) => a.date === selected).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <PageHeader title="Appointments" subtitle="Click a day to see and schedule appointments." action={<Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Schedule</Btn>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{month.toLocaleString("en", { month: "long", year: "numeric" })}</h2>
            <div className="flex gap-1">
              <Btn variant="outline" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Btn>
              <Btn variant="outline" onClick={() => { setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelected(iso(now)); }}>Today</Btn>
              <Btn variant="outline" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Btn>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const k = iso(d);
              const count = s.appointments.filter((a) => a.date === k).length;
              return (
                <button key={k} onClick={() => setSelected(k)}
                  className={cn("flex h-16 flex-col items-start rounded-lg border p-1.5 text-left text-xs transition sm:h-20",
                    d.getMonth() !== month.getMonth() && "opacity-40",
                    k === selected ? "border-primary bg-accent" : "hover:bg-muted",
                    k === iso(now) && "font-bold text-primary")}>
                  {d.getDate()}
                  {count > 0 && <span className="mt-auto rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{count} appt</span>}
                </button>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">{new Date(selected + "T00:00").toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</h2>
          <ul className="space-y-3">
            {dayAppts.map((a) => (
              <li key={a.id} className="flex items-start justify-between rounded-xl border p-3 text-sm">
                <div><p className="font-semibold">{a.time} · {s.patientName(a.patientId)}</p><p className="text-muted-foreground">{a.type} with {a.provider}</p></div>
                <button aria-label="Cancel appointment" className="rounded p-1 text-muted-foreground hover:bg-muted" onClick={() => { s.cancelAppointment(a.id); toast.success("Appointment cancelled"); }}><X className="h-4 w-4" /></button>
              </li>
            ))}
            {dayAppts.length === 0 && <p className="text-sm text-muted-foreground">No appointments this day.</p>}
          </ul>
        </Card>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={`Schedule on ${selected}`}>
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); s.addAppointment({ ...f, date: selected }); toast.success("Appointment scheduled"); setOpen(false); }}>
          <Field label="Patient"><select className={inputCls} value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })}>{s.patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date"><input type="date" className={inputCls} value={selected} onChange={(e) => setSelected(e.target.value)} /></Field>
            <Field label="Time"><input type="time" className={inputCls} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></Field>
            <Field label="Provider"><input className={inputCls} value={f.provider} onChange={(e) => setF({ ...f, provider: e.target.value })} /></Field>
            <Field label="Type"><input className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} /></Field>
          </div>
          <div className="flex justify-end gap-2 pt-2"><Btn type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn type="submit">Schedule</Btn></div>
        </form>
      </Modal>
    </>
  );
}
